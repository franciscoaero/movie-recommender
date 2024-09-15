import React, { useState } from 'react';
import api from '../services/api'; // Importe a instância de API configurada com o token

function AddUser() {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Sending request to /users with username:', username);  // Log para depuração antes do envio

      // Use a instância 'api' com o token JWT já configurado
      const response = await api.post('/users', { username });

      console.log('Response:', response);  // Log para verificar a resposta do servidor
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
