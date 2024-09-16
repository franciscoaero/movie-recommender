import React, { useEffect, useState } from 'react';
import api from '../services/api';  // Importe a instância de API configurada com o token
import { useMsal } from '@azure/msal-react';  // Hook para autenticação
import { useParams } from 'react-router-dom';

function RateMovie() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [rating, setRating] = useState('');
  const { userId } = useParams();  // Pegando o userId da URL
  const { instance, accounts } = useMsal();  // Acessa a instância e as contas autenticadas

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Verifica se há uma conta ativa
        const account = accounts.length > 0 ? accounts[0] : null;

        if (!account) {
          console.error('No active account! Please log in.');
          return;
        }

        // Obtém o token de acesso silenciosamente
        const response = await instance.acquireTokenSilent({
          scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"],
          account: account
        });

        const token = response.accessToken;

        // Faz a requisição para buscar a lista de filmes
        const res = await api.get('/movies', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setMovies(res.data.movies);  // Atualiza o estado com os filmes retornados
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      }
    };

    fetchMovies();
  }, [instance, accounts]);

  const submitRating = async () => {
    if (!selectedMovieId || !rating || !userId) {
      alert('Por favor, selecione um filme, forneça uma classificação e um usuário.');
      return;
    }

    try {
      // Verifica se há uma conta ativa
      const account = accounts.length > 0 ? accounts[0] : null;

      if (!account) {
        console.error('No active account! Please log in.');
        return;
      }

      // Obtém o token de acesso silenciosamente
      const response = await instance.acquireTokenSilent({
        scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"],
        account: account
      });

      const token = response.accessToken;

      // Envia a classificação usando a API com o token
      await api.post('/ratings', {
        user_id: userId,  // Inclui o userId da URL
        movie_id: selectedMovieId,
        rating: parseFloat(rating)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Classificação enviada com sucesso!');
      setRating('');
      setSelectedMovieId('');
    } catch (error) {
      console.error('Erro ao enviar a classificação:', error);
      alert('Erro ao enviar a classificação.');
    }
  };

  return (
    <div>
      <h1>Rate a Movie</h1>
      
      <select
        value={selectedMovieId}
        onChange={e => setSelectedMovieId(e.target.value)}
      >
        <option value="">Selecione um filme</option>
        {movies.map(movie => (
          <option key={movie.id} value={movie.id}>
            {movie.title}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={e => setRating(e.target.value)}
        placeholder="Classifique de 1 a 5"
      />

      <button onClick={submitRating}>Enviar Classificação</button>
    </div>
  );
}

export default RateMovie;
