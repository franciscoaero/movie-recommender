import React, { useState } from 'react';
import api from '../services/api'; // Importe a instância de API configurada com o token
import { useMsal } from '@azure/msal-react'; // Para obter a instância MSAL

function AddUser() {
  const [username, setUsername] = useState("");
  const { instance } = useMsal(); // Obter a instância MSAL para adquirir o token

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Pegar a conta ativa
      const account = instance.getActiveAccount();
      console.log('Current Account:', account); // Log para verificar a conta ativa

      if (!account) {
        console.error('No active account! Please log in.');
        return;
      }

      // Adquirir o token silenciosamente
      const response = await instance.acquireTokenSilent({
        scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"],
        account: account
      });

      const token = response.accessToken;
      console.log('Access Token:', token); // Log para verificar o token antes de enviá-lo

      console.log('Sending request to /users with username:', username);  // Log para depuração antes do envio

      // Fazendo a requisição para o backend com o token JWT no cabeçalho
      const res = await api.post('/users', 
        { username }, 
        {
          headers: {
            'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho da requisição
          }
        }
      );

      console.log('Response:', res);  // Log para verificar a resposta do servidor
      alert('User created successfully!');
      setUsername(""); // Limpa o campo de input
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
