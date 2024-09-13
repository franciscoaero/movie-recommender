import React from 'react';
import { Routes, Route, Link, BrowserRouter as Router, useParams } from 'react-router-dom';
import TopRatedMovies from './components/TopRatedMovies';
import RateMovie from './components/RateMovie';
import AddMovie from './components/AddMovie';
import AddUser from './components/AddUser';
import UserSelection from './components/UserSelection';
import './App.css';

// Componente para ajustar a navegação com base no userId
function Navigation({ userId }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🎬 Movie Rating</div>
      <ul className="navbar-menu">
        <li><Link to={userId ? `/user/${userId}/top-rated` : '/'}>Home</Link></li>
        {userId && (
          <>
            <li><Link to={`/user/${userId}/rate-movie`}>Rate a Movie</Link></li>
            <li><Link to={`/user/${userId}/add-movie`}>Add a Movie</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <header>
        {/* Mantendo o header sempre visível */}
        <Routes>
          <Route path="/user/:userId/*" element={<UserNavigation />} />
          <Route path="*" element={<Navigation />} />  {/* Header visível na tela inicial também */}
        </Routes>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<UserSelection />} />  {/* Tela inicial com seleção de usuário */}
          <Route path="/user/:userId/top-rated" element={<TopRatedMovies />} />
          <Route path="/user/:userId/rate-movie" element={<RateMovie />} />
          <Route path="/user/:userId/add-movie" element={<AddMovie />} />
          <Route path="/add-user" element={<AddUser />} />  {/* Adicionar usuário */}
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2024 Movie Rating App - All rights reserved</p>
      </footer>
    </Router>
  );
}

// Componente que ajusta a navegação com base no userId
function UserNavigation() {
  const { userId } = useParams();  // Pegando o userId da URL
  return <Navigation userId={userId} />;
}

export default App;
