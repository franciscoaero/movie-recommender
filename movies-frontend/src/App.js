import React from 'react';
import { Routes, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import TopRatedMovies from './components/TopRatedMovies';
import RateMovie from './components/RateMovie';
import AddMovie from './components/AddMovie';
import AddUser from './components/AddUser';  // Importando o componente de adicionar usuário
import UserSelection from './components/UserSelection';  // Importando o componente de seleção de usuário
import './App.css';

function App() {
  return (
    <Router>
      <header>
        <nav className="navbar">
          <div className="navbar-brand">🎬 Movie Rating</div>
          <ul className="navbar-menu">
            <li><Link to="/">Top Rated Movies</Link></li>
            <li><Link to="/rate-movie">Rate a Movie</Link></li>
            <li><Link to="/add-movie">Add a Movie</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<UserSelection />} />  {/* Tela inicial com seleção de usuário */}
          <Route path="/user/:userId" element={<TopRatedMovies />} />  {/* Após selecionar o usuário */}
          <Route path="/rate-movie" element={<RateMovie />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/add-user" element={<AddUser />} />  {/* Adicionar usuário */}
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2024 Movie Rating App - All rights reserved</p>
      </footer>
    </Router>
  );
}

export default App;
