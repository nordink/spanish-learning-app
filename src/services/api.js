const API_URL = 'https://language-learning-server-production.up.railway.app/api';

export const getLists = async (getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/lists`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch lists');
  return response.json();
};

export const createList = async (name, getToken) => {
  const token = await getToken();
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

export const deleteList = async (listId, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/lists/${listId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete list');
  return response.json();
};

export const getWordsForList = async (listId, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/words/list/${listId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch words');
  return response.json();
};

export const addWord = async (wordData, getToken) => {
  const token = await getToken();
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

export const updateWord = async (wordId, wordData, getToken) => {
  const token = await getToken();
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

export const deleteWord = async (wordId, getToken) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/words/${wordId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete word');
  return response.json();
};