import React from 'react';
import { Routes, Route, Link, BrowserRouter as Router, useParams, useNavigate } from 'react-router-dom';
import TopRatedMovies from './components/TopRatedMovies';
import RateMovie from './components/RateMovie';
import AddMovie from './components/AddMovie';
import AddUser from './components/AddUser';
import UserSelection from './components/UserSelection';
import './App.css';

import { MsalProvider, useIsAuthenticated } from '@azure/msal-react';  // Importar MSAL para autenticação
import { PublicClientApplication } from '@azure/msal-browser';
import LoginButton from './components/LoginButton';  // Importar o botão de login
import { msalConfig } from './msalConfig';  // Importar a configuração do MSAL

const msalInstance = new PublicClientApplication(msalConfig);

// Componente de Login
function LoginPage() {
  const isAuthenticated = useIsAuthenticated();  // Verifica se o usuário está autenticado
  const navigate = useNavigate();

  // Se o usuário já estiver autenticado, redireciona para a tela de seleção de usuários
  if (isAuthenticated) {
    navigate("/users");  // Redireciona para a rota de usuários
  }

  return (
    <div className="login-page">
      <h1>Welcome to Movie Rating App</h1>
      <LoginButton />  {/* Botão de login */}
    </div>
  );
}

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
    <MsalProvider instance={msalInstance}>
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
            {/* Rota de Login */}
            <Route path="/" element={<LoginPage />} />  {/* Tela de login como padrão */}
            
            {/* Rota de Seleção de Usuário */}
            <Route path="/users" element={<UserSelection />} />  {/* Tela de seleção de usuários */}

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
    </MsalProvider>
  );
}

// Componente que ajusta a navegação com base no userId
function UserNavigation() {
  const { userId } = useParams();  // Pegando o userId da URL
  return <Navigation userId={userId} />;
}

export default App;
