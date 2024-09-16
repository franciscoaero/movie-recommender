import React, { useEffect, useState } from 'react';
import api from '../services/api';  // Importe a instância de API configurada com o token
import { useMsal } from '@azure/msal-react';  // Para acessar a instância MSAL e pegar a conta ativa

const UserList = () => {
  const [users, setUsers] = useState([]);
  const { instance, accounts } = useMsal();  // Acessa a instância do MSAL

  useEffect(() => {
    // Verifique se há uma conta ativa antes de fazer a requisição
    const activeAccount = accounts.length > 0 ? accounts[0] : null;

    if (activeAccount) {
      // Obtém o token de acesso antes de fazer a chamada à API
      instance.acquireTokenSilent({
        account: activeAccount,
        scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"]
      }).then(response => {
        const token = response.accessToken;

        // Define o token na instância de API
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Faz a requisição para buscar a lista de usuários
        api.get('/users')
          .then(response => {
            setUsers(response.data);  // Atualiza o estado com os usuários retornados
          })
          .catch(error => {
            console.error("There was an error fetching the users!", error);
          });
      }).catch(error => {
        console.error("Error acquiring token silently", error);
      });
    } else {
      console.log("No active account! Please log in.");
    }
  }, [instance, accounts]);  // Executa o useEffect quando a conta ou instância mudar

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
