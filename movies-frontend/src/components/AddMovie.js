import React, { useState } from 'react';
import axios from 'axios';

function AddMovie() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/movies', { title });
      if (response.status === 201) {
        setSuccess('Movie added successfully!');
        setTitle(''); // Limpa o campo após adicionar
      } else {
        setError('Something went wrong!');
      }
    } catch (err) {
      setError('Error adding movie. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add a New Movie</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Movie Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Movie</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default AddMovie;
