import React, { useState } from 'react';
import axios from 'axios';

function AddUser() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5000/users', { username })
      .then(response => {
        alert('User created successfully!');
        setUsername("");
      })
      .catch(error => {
        alert('Error creating user.');
      });
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
