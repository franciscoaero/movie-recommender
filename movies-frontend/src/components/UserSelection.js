import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';  // Importar o hook do MSAL para pegar o token

function UserSelection() {
  const [users, setUsers] = useState([]);
  const { instance } = useMsal();  // Pega a instância do MSAL

  useEffect(() => {
    const fetchUsers = async () => {
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

        // Faz a requisição ao backend com o token de autenticação
        const res = await axios.get('https://app-movies-dev-001-a7c0f2b7a3bwckgc.brazilsouth-01.azurewebsites.net/users', {
          headers: {
            'Authorization': `Bearer ${token}`  // Passa o token no cabeçalho da requisição
          }
        });

        setUsers(res.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, [instance]);

  return (
    <div className="user-selection">
      <h1>Select User:</h1>
      <div className="user-grid">
        {users.map(user => (
          <Link key={user.id} to={`/user/${user.id}/top-rated`} className="user-card">
            {user.username.charAt(0).toUpperCase()}
          </Link>
        ))}
      </div>
      <div className="add-user">
        <Link to="/add-user">
          <button>Add New User</button>
        </Link>
      </div>
    </div>
  );
}

export default UserSelection;
