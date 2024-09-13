import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TopRatedMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/movies/top-rated')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the top rated movies!', error);
      });
  }, []);

  return (
    <div>
      <h2>Top Rated Movies</h2>
      <div className="movie-list">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            {/* Adicionando a imagem da capa */}
            <img 
              src={movie.cover_url} 
              alt={`${movie.title} cover`} 
              className="movie-cover" 
            />
            <h3>{movie.title}</h3>
            <p>Rating: {movie.average_rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopRatedMovies;
