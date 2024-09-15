import React, { useState } from 'react';
import api from '../services/api'; // Importe a instância de API configurada com o token

function AddUser() {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use a instância 'api' com o token JWT já configurado
      await api.post('/users', { username });
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
