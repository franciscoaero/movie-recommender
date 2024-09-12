import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RateMovie() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [rating, setRating] = useState('');
  const [userId, setUserId] = useState('1'); // Definindo um ID de usuário fixo, pode ser alterado

  useEffect(() => {
    axios.get('http://localhost:5000/movies')
      .then(response => {
        setMovies(response.data.movies);
      })
      .catch(error => {
        console.error('Erro ao buscar filmes:', error);
      });
  }, []);

  const submitRating = () => {
    if (!selectedMovieId || !rating || !userId) {
      alert('Por favor, selecione um filme, forneça uma classificação e um usuário.');
      return;
    }

    axios.post('http://localhost:5000/ratings', {
      user_id: userId, // Incluindo user_id na requisição
      movie_id: selectedMovieId,
      rating: parseFloat(rating),
    })
    .then(response => {
      alert('Classificação enviada com sucesso!');
      setRating('');
      setSelectedMovieId('');
    })
    .catch(error => {
      console.error('Erro ao enviar a classificação:', error);
    });
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

      {/* Adicionando campo para o usuário se necessário */}
      <input
        type="text"
        value={userId}
        onChange={e => setUserId(e.target.value)}
        placeholder="User ID"
      />

      <button onClick={submitRating}>Enviar Classificação</button>
    </div>
  );
}

export default RateMovie;
