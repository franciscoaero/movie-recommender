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
        console.error('Error fetching top-rated movies:', error);
      });
  }, []);

  return (
    <div>
      <h1>Top Rated Movies</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            {movie.title} - Rating: {movie.average_rating}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopRatedMovies;
