import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UserSelection() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('${backendUrl}/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  return (
    <div className="user-selection">
      <h1>Select User</h1>
      <div className="user-grid">
        {users.map(user => (
          <Link key={user.id} to={`/user/${user.id}/top-rated`} className="user-card">
            {user.username.charAt(0).toUpperCase()}
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
