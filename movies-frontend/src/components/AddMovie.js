import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';  // Importar o hook do MSAL para pegar o token
import api from '../services/api'; // Importe a instância de API configurada com o token

function AddMovie() {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState(null);
  const { instance, accounts } = useMsal();  // Acessa a instância e as contas autenticadas

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCoverChange = (e) => {
    setCover(e.target.files[0]); // Captura o arquivo de imagem
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifique se o título e a capa estão preenchidos
    if (!title || !cover) {
      alert("Both title and cover are required.");
      return;
    }

    // Verifica se há uma conta ativa
    const account = accounts.length > 0 ? accounts[0] : null;
    if (!account) {
      console.error('No active account! Please log in.');
      return;
    }

    try {
      // Obtém o token de acesso silenciosamente
      const response = await instance.acquireTokenSilent({
        scopes: ["api://aaece82d-86c9-4dbb-be37-60f630246081/access_as_user"],
        account: account
      });

      const token = response.accessToken;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('cover', cover);

      // Faz a requisição ao backend usando a instância api com o token JWT
      await api.post('/movies', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Adiciona o token no cabeçalho
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Movie added successfully!');
      setTitle('');  // Limpa o campo do título
      setCover(null);  // Limpa o campo do arquivo de capa
    } catch (error) {
      console.error('Error uploading movie:', error);
      alert('Failed to add movie');
      instance.loginRedirect();  // Redireciona para a página de login
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Movie Title:</label>
        <input type="text" value={title} onChange={handleTitleChange} required />
      </div>
      <div>
        <label>Cover Image:</label>
        <input type="file" onChange={handleCoverChange} accept="image/*" required />
      </div>
      <button type="submit">Add Movie</button>
    </form>
  );
}

export default AddMovie;
