import React, { useState, useEffect } from 'react';
import { getLists, createList } from '../api';

const ListManagement = ({ onSelectList }) => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const userLists = await getLists();
      setLists(userLists);
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      await createList(newListName);
      setNewListName('');
      await loadLists();
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleCreateList} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter new list name"
          style={{
            padding: '8px',
            marginRight: '10px',
            borderRadius: '4px',
            border: '1px solid #444',
            backgroundColor: '#333',
            color: '#fff'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create List
        </button>
      </form>

      <div className="lists-container">
        {lists.map(list => (
          <div
            key={list._id}
            onClick={() => onSelectList(list)}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#2d2d2d',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid #444'
            }}
          >
            <h3 style={{ margin: 0 }}>{list.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListManagement;