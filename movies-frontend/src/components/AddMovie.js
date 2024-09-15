import React, { useState } from 'react';
import api from '../services/api'; // Importe a instância de API configurada com o token

function AddMovie() {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState(null);

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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('cover', cover);

    try {
      // Use a instância 'api' com o token JWT já configurado
      await api.post('/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Movie added successfully!');
    } catch (error) {
      console.error('Error uploading movie:', error);
      alert('Failed to add movie');
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
