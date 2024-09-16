import React, { useState } from 'react';
import api from '../services/api';
import { useMsal } from '@azure/msal-react';

function AddUser() {
  const [username, setUsername] = useState("");
  const { instance } = useMsal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verificar se o usuário está logado
      let account = instance.getActiveAccount();

      if (!account) {
        console.log('No active account! Redirecting to login.');
        
        // Se não houver conta ativa, forçar o login
        const loginResponse = await instance.loginPopup({
          scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"]
        });
        
        account = loginResponse.account; // Atualizar a conta após o login
      }

      console.log('Current Account:', account);

      // Adquirir o token com a conta ativa
      const response = await instance.acquireTokenSilent({
        scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"],
        account: account
      });

      const token = response.accessToken;
      console.log('Access Token:', token);

      console.log('Sending request to /users with username:', username);

      // Enviar requisição com o token JWT no cabeçalho
      const res = await api.post('/users', 
        { username }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Response:', res);
      alert('User created successfully!');
      setUsername(""); // Limpar campo de input
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user.');
    }
  };

  return (
    <div>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter username" 
          required 
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AddUser;
