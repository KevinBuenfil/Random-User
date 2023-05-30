import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      const newUser = data.results[0];
      setUsers([...users, newUser]);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar el usuario');
      setLoading(false);
    }
  };

  const deleteUser = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  };

  const editUser = (index) => {
    setEditIndex(index);
    setEditName(users[index].name.first);
  };

  const saveEdit = () => {
    const updatedUsers = [...users];
    updatedUsers[editIndex].name.first = editName;
    setUsers(updatedUsers);
    setEditIndex(-1);
    setEditName('');
  };

  return (
    <div className='Principal'>
      <h1>Lista de Usuarios Aleatorios</h1>
      <button onClick={fetchUser}>Generar usuario aleatorio</button>

      {loading ? (
        <p>Cargando usuario...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {users.map((user, index) => (
            <div key={index} className="user-card">
              <img src={user.picture.large} alt="User" />
              {editIndex === index ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              ) : (
                <p>{user.name.first}</p>
              )}
              <div>
                {editIndex === index ? (
                  <button onClick={saveEdit}>Guardar</button>
                ) : (
                  <>
                    <button onClick={() => deleteUser(index)}>Eliminar</button>
                    <button onClick={() => editUser(index)}>Editar</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
