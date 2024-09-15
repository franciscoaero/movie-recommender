from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
from azure.storage.blob import BlobServiceClient, ContentSettings
from werkzeug.utils import secure_filename
import jwt
import requests
from functools import wraps
from jwt.algorithms import RSAAlgorithm
import json

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

application = Flask(__name__)

# Habilitar CORS
CORS(application)

# Verificar se está em desenvolvimento ou produção
if os.getenv('FLASK_ENV') == 'development':
    # Se o ambiente for de desenvolvimento, utilizar SQLite
    application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///local.db'  # Banco de dados local
    print("Usando banco de dados local SQLite")
else:
    # Configuração para Azure SQL Server
    driver = '{ODBC Driver 18 for SQL Server}'
    server = os.getenv('AZURE_SQL_SERVER')
    database = os.getenv('AZURE_SQL_DATABASE')

    # Verificar se as variáveis de ambiente estão corretamente definidas
    if not server or not database:
        raise ValueError("As variáveis de ambiente 'AZURE_SQL_SERVER' e 'AZURE_SQL_DATABASE' precisam ser definidas.")
    
    print(f"Servidor: {server}")
    print(f"Banco de dados: {database}")

    connection_string = (
        f'Driver={driver};'
        f'Server={server};'
        f'Database={database};'
        f'Encrypt=yes;'
        f'TrustServerCertificate=no;'
        f'Connection Timeout=30;'
        f'Authentication=ActiveDirectoryManagedIdentity;'  # Usando Managed Identity
    )

    try:
        application.config['SQLALCHEMY_DATABASE_URI'] = f'mssql+pyodbc:///?odbc_connect={connection_string}'
    except Exception as e:
        print(f"Erro ao configurar a string de conexão: {e}")

application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar o banco de dados
try:
    db = SQLAlchemy(application)
except Exception as e:
    print(f"Erro ao conectar ao banco de dados: {e}")

# Configuração do Azure Blob Storage
blob_service_client = BlobServiceClient.from_connection_string(os.getenv('AZURE_STORAGE_CONNECTION_STRING'))
container_name = 'movie-covers'  # Certifique-se de que este container existe no Azure

# Definição do modelo Movie com campo para URL da imagem
class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=True, nullable=False)
    cover_url = db.Column(db.String(500), nullable=True)

# Definição do modelo User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

# Definição do modelo Rating
class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)

# Função para obter a chave pública do Azure AD
def get_jwks_keys():
    jwks_url = f"https://login.microsoftonline.com/{os.getenv('AZURE_TENANT_ID')}/discovery/v2.0/keys"
    response = requests.get(jwks_url)
    return response.json()

# Função para verificar o token JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Pega o token do cabeçalho Authorization
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]  # O token vem como "Bearer {token}"

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Obtenha as chaves públicas (JWKS) do Azure AD
            jwks = get_jwks_keys()

            # Pega o cabeçalho do token JWT
            header = jwt.get_unverified_header(token)

            # Busca a chave correspondente pelo 'kid'
            rsa_key = {}
            for key in jwks['keys']:
                if key['kid'] == header['kid']:
                    rsa_key = {
                        'kty': key['kty'],
                        'kid': key['kid'],
                        'use': key['use'],
                        'n': key['n'],
                        'e': key['e']
                    }
                    break

            if not rsa_key:
                return jsonify({'message': 'Token is invalid! RSA key not found.'}), 401

            # Decodificar e verificar o token
            public_key = RSAAlgorithm.from_jwk(json.dumps(rsa_key))
            decoded = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=os.getenv('AZURE_CLIENT_ID'),  # Verifique o 'aud' (audience)
                issuer=f"https://sts.windows.net/{os.getenv('AZURE_TENANT_ID')}/"  # Verifique o emissor
            )
            current_user = decoded['sub']  # ID do usuário (subject)

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# Rota inicial
@application.route('/')
def home():
    return jsonify(message="Welcome to the Movie Recommendation API!")

# Endpoint para listar todos os usuários
@application.route('/users', methods=['GET'])
@token_required
def get_users(current_user):
    users = User.query.all()
    result = [{'id': user.id, 'username': user.username} for user in users]
    return jsonify(result), 200

# Endpoint para adicionar um novo usuário
@application.route('/users', methods=['POST'])
@token_required
def add_user(current_user):
    username = request.json.get('username')
    if username is None or User.query.filter_by(username=username).first():
        return jsonify({'message': 'Invalid username or username already exists'}), 400

    new_user = User(username=username)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'id': new_user.id, 'username': new_user.username}), 201

# Função para upload da capa do filme
def upload_cover_to_blob(file):
    try:
        # Preparar o nome seguro do arquivo
        filename = secure_filename(file.filename)

        # Criar um cliente para o blob
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=filename)

        # Definir o tipo de conteúdo para a imagem
        blob_client.upload_blob(file, content_settings=ContentSettings(content_type=file.content_type))

        # Retornar a URL do blob
        return blob_client.url
    except Exception as e:
        print(f"Erro ao fazer upload da capa: {e}")
        return None
    
# Endpoint para adicionar um novo filme com upload da capa
@application.route('/movies', methods=['POST'])
@token_required
def add_movie(current_user):
    title = request.form.get('title')
    cover = request.files.get('cover')

    if title is None or Movie.query.filter_by(title=title).first():
        return jsonify({'message': 'Invalid title or movie already exists'}), 400

    # Upload da capa para o Azure Blob Storage
    cover_url = upload_cover_to_blob(cover) if cover else None

    # Criar o novo filme
    new_movie = Movie(title=title, cover_url=cover_url)
    db.session.add(new_movie)
    db.session.commit()
    
    return jsonify({'id': new_movie.id, 'title': new_movie.title, 'cover_url': new_movie.cover_url}), 201

# Endpoint para adicionar uma avaliação de filme
@application.route('/ratings', methods=['POST'])
@token_required
def add_rating(current_user):
    user_id = request.json.get('user_id')
    movie_id = request.json.get('movie_id')
    rating_value = request.json.get('rating')
    
    if not (1 <= rating_value <= 5):
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400
    
    new_rating = Rating(user_id=user_id, movie_id=movie_id, rating=rating_value)
    db.session.add(new_rating)
    db.session.commit()
    
    return jsonify({'id': new_rating.id, 'user_id': new_rating.user_id, 'movie_id': new_rating.movie_id, 'rating': new_rating.rating}), 201

# Endpoint para retornar os filmes com melhores classificações
@application.route('/movies/top-rated', methods=['GET'])
@token_required
def get_top_rated_movies(current_user):
    top_rated_movies = db.session.query(
        Movie.id, Movie.title, Movie.cover_url, db.func.avg(Rating.rating).label('average_rating')
    ).join(Rating).group_by(Movie.id, Movie.title, Movie.cover_url).order_by(db.desc('average_rating')).all()

    movies = [
        {
            'id': movie.id,
            'title': movie.title,
            'cover_url': movie.cover_url,
            'average_rating': round(movie.average_rating, 1)
        }
        for movie in top_rated_movies
    ]
    return jsonify(movies), 200

# Endpoint para consultar as avaliações de um filme específico
@application.route('/movies/<int:movie_id>/ratings', methods=['GET'])
@token_required
def get_movie_ratings(current_user, movie_id):
    ratings = Rating.query.filter_by(movie_id=movie_id).all()
    
    if not ratings:
        return jsonify({'message': 'No ratings found for this movie'}), 404
    
    results = [{'user_id': r.user_id, 'rating': r.rating} for r in ratings]
    return jsonify({'movie_id': movie_id, 'ratings': results}), 200

# Endpoint para listar todos os filmes
@application.route('/movies', methods=['GET'])
@token_required
def get_movies(current_user):
    movies = Movie.query.all()
    results = [{'id': movie.id, 'title': movie.title} for movie in movies]
    
    return jsonify({'movies': results}), 200

if __name__ == '__main__':
    with application.app_context():
        db.create_all()  # Cria as tabelas no banco de dados
    application.run(debug=True)
