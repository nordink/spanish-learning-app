// api.js
import { useAuth0 } from '@auth0/auth0-react';

const API_URL = 'https://language-learning-server-production.up.railway.app/api';

// List related API calls
export const getLists = async () => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  
  const response = await fetch(`${API_URL}/lists`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch lists');
  return response.json();
};

export const createList = async (name) => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  
  const response = await fetch(`${API_URL}/lists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to create list');
  return response.json();
};

export const deleteList = async (listId) => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  
  const response = await fetch(`${API_URL}/lists/${listId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete list');
  return response.json();
};

// Word related API calls
export const getWordsForList = async (listId) => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  
  const response = await fetch(`${API_URL}/words/list/${listId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch words');
  return response.json();
};

export const addWord = async (wordData) => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  
  const response = await fetch(`${API_URL}/words`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(wordData)
  });
  if (!response.ok) throw new Error('Failed to add word');
  return response.json();
};

export const updateWord = async (wordId, wordData) => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  
  const response = await fetch(`${API_URL}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(wordData)
  });
  if (!response.ok) throw new Error('Failed to update word');
  return response.json();
};

export const deleteWord = async (wordId) => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  
  const response = await fetch(`${API_URL}/words/${wordId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete word');
  return response.json();
};