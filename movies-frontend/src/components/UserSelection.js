import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import api from '../services/api';

function UserSelection() {
  const [users, setUsers] = useState([]);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const fetchUsers = async () => {
      const activeAccount = accounts.length > 0 ? accounts[0] : null;
      console.log('Active Account:', activeAccount);

      if (!activeAccount) {
        console.error('No active account! Please log in.');
        return;
      }

      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"],
          account: activeAccount,
        });

        const token = response.accessToken;
        console.log('[U.S] Access Token:', token);

        // Faz a requisição para buscar os usuários
        const res = await api.get('/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('[U.S] User Data:', res.data);
        setUsers(res.data); // Atualiza o estado com os usuários
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, [instance, accounts]);

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
