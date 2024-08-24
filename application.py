from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

application = Flask(__name__)

# Configuração do banco de dados SQLite local
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movies.db'
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialização do SQLAlchemy
db = SQLAlchemy(application)

# Definição do modelo User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

# Definição do modelo Movie
class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=True, nullable=False)

# Definição do modelo Rating
class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)

# Rota inicial
@application.route('/')
def home():
    return jsonify(message="Welcome to the Movie Recommendation API!")

# Endpoint para adicionar um novo usuário
@application.route('/users', methods=['POST'])
def add_user():
    username = request.json.get('username')
    if username is None or User.query.filter_by(username=username).first():
        return jsonify({'message': 'Invalid username or username already exists'}), 400

    new_user = User(username=username)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'id': new_user.id, 'username': new_user.username}), 201

# Endpoint para adicionar um novo filme
@application.route('/movies', methods=['POST'])
def add_movie():
    title = request.json.get('title')
    if title is None or Movie.query.filter_by(title=title).first():
        return jsonify({'message': 'Invalid title or movie already exists'}), 400

    new_movie = Movie(title=title)
    db.session.add(new_movie)
    db.session.commit()
    
    return jsonify({'id': new_movie.id, 'title': new_movie.title}), 201

# Endpoint para adicionar uma avaliação de filme
@application.route('/ratings', methods=['POST'])
def add_rating():
    user_id = request.json.get('user_id')
    movie_id = request.json.get('movie_id')
    rating_value = request.json.get('rating')
    
    if not (1 <= rating_value <= 5):
        return jsonify({'message': 'Rating must be between 1 and 5'}), 400
    
    new_rating = Rating(user_id=user_id, movie_id=movie_id, rating=rating_value)
    db.session.add(new_rating)
    db.session.commit()
    
    return jsonify({'id': new_rating.id, 'user_id': new_rating.user_id, 'movie_id': new_rating.movie_id, 'rating': new_rating.rating}), 201

# Endpoint para consultar as avaliações de um filme específico
@application.route('/movies/<int:movie_id>/ratings', methods=['GET'])
def get_movie_ratings(movie_id):
    ratings = Rating.query.filter_by(movie_id=movie_id).all()
    
    if not ratings:
        return jsonify({'message': 'No ratings found for this movie'}), 404
    
    results = [{'user_id': r.user_id, 'rating': r.rating} for r in ratings]
    return jsonify({'movie_id': movie_id, 'ratings': results}), 200

if __name__ == '__main__':
    with application.app_context():
        db.create_all()  # Cria as tabelas no banco de dados
    application.run(debug=True)
