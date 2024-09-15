import React, { useEffect, useState } from 'react';
import api from '../services/api';  // Importe a instância de API configurada com o token

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Usando a instância 'api' para fazer a requisição com o token JWT
    api.get('/users')
      .then(response => {
        setUsers(response.data);  // Atualiza o estado com os usuários retornados
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
