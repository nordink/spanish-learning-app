// src/services/api.js

const API_URL = 'language-learning-server-production.up.railway.app'; // Adjust this to match your API URL

// List related API calls
export const getLists = async () => {
  const response = await fetch(`${API_URL}/lists`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch lists');
  return response.json();
};

export const createList = async (name) => {
  const response = await fetch(`${API_URL}/lists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to create list');
  return response.json();
};

export const deleteList = async (listId) => {
  const response = await fetch(`${API_URL}/lists/${listId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to delete list');
  return response.json();
};

// Word related API calls
export const getWordsForList = async (listId) => {
  const response = await fetch(`${API_URL}/words/list/${listId}`, {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch words');
  return response.json();
};

export const addWord = async (wordData) => {
  const response = await fetch(`${API_URL}/words`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(wordData)
  });
  if (!response.ok) throw new Error('Failed to add word');
  return response.json();
};

export const updateWord = async (wordId, wordData) => {
  const response = await fetch(`${API_URL}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(wordData)
  });
  if (!response.ok) throw new Error('Failed to update word');
  return response.json();
};

export const deleteWord = async (wordId) => {
  const response = await fetch(`${API_URL}/words/${wordId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to delete word');
  return response.json();
};