import React, { useState } from 'react';
import axios from 'axios';

const AddUser = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviando o novo usuário para a API
    axios.post('http://localhost:5000/users', { username })
      .then(response => {
        alert('Usuário adicionado com sucesso!');
        setUsername('');
      })
      .catch(error => {
        console.error('Erro ao adicionar usuário:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adicionar Usuário</h3>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nome do usuário"
      />
      <button type="submit">Adicionar</button>
    </form>
  );
};

export default AddUser;
