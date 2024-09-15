import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';  // Importar hook do MSAL para pegar o token

function TopRatedMovies() {
  const [movies, setMovies] = useState([]);
  const { instance } = useMsal();  // Pega a instância do MSAL

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Pega a conta do usuário autenticado
        const account = instance.getActiveAccount();
        if (!account) {
          console.error('No active account! Please log in.');
          return;
        }

        // Usa o método acquireTokenSilent para obter o token de acesso
        const response = await instance.acquireTokenSilent({
          scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"],
          account: account
        });

        const token = response.accessToken;

        // Faz a requisição ao backend com o token
        const res = await axios.get('https://app-movies-dev-001-a7c0f2b7a3bwckgc.brazilsouth-01.azurewebsites.net/movies/top-rated', {
          headers: {
            'Authorization': `Bearer ${token}`  // Adiciona o token no cabeçalho
          }
        });

        setMovies(res.data);
      } catch (error) {
        console.error('Erro ao buscar os filmes com melhor classificação!', error);
      }
    };

    fetchMovies();
  }, [instance]);

  return (
    <div>
      <h2>Top Rated Movies</h2>
      <div className="movie-list">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
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
