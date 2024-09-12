import React from 'react';
import { Routes, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import TopRatedMovies from './components/TopRatedMovies';
import RateMovie from './components/RateMovie';
import AddMovie from './components/AddMovie'; // Importando o novo componente
import './App.css'; // Importando o arquivo de CSS

function App() {
  return (
    <Router>
      <header>
        <nav className="navbar">
          <div className="navbar-brand">🎬 Movie Rating</div>
          <ul className="navbar-menu">
            <li><Link to="/">Top Rated Movies</Link></li>
            <li><Link to="/rate-movie">Rate a Movie</Link></li>
            <li><Link to="/add-movie">Add a Movie</Link></li> {/* Link para o novo componente */}
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<TopRatedMovies />} />
          <Route path="/rate-movie" element={<RateMovie />} />
          <Route path="/add-movie" element={<AddMovie />} /> {/* Nova rota */}
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2024 Movie Rating App - All rights reserved</p>
      </footer>
    </Router>
  );
}

export default App;
