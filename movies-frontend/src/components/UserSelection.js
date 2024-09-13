import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UserSelection() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Carregar os usuários da API
    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  return (
    <div className="user-selection">
      <h2>Select Your Profile</h2>
      <div className="user-grid">
        {users.map(user => (
          <Link to={`/user/${user.id}`} key={user.id} className="user-card">
            <div className="user-avatar">{user.username.charAt(0)}</div>
            <p>{user.username}</p>
          </Link>
        ))}
      </div>
      <div className="add-user">
        <Link to="/add-user">
          <button>Add New User</button>
        </Link>
      </div>
    </div>
  );
}

export default UserSelection;
