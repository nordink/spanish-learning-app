import React, { useState, useEffect, useCallback } from 'react';
import { login, handleAuthentication, logout, isAuthenticated } from './services/auth-service';
import {
  getLists,
  createList,
  deleteList,
  getWordsForList,
  addWord,
  updateWord,
  deleteWord,
  renameList
} from './services/api';
import './fonts.css';
import CelebrationAnimation from './components/CelebrationAnimation';
console.log('CelebrationAnimation component:', CelebrationAnimation);
console.log('App.jsx is loading');

const App = () => {
console.log('App component is rendering');
  // Auth state
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    error: null
  });
  
  // App state
  const [lists, setLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [sessionWords, setSessionWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [showManagement, setShowManagement] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isInputCooldown, setIsInputCooldown] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    remaining: 0,
    dueToday: 0
  });

  // Additional state for word management
  const [newListName, setNewListName] = useState('');
  const [editingWord, setEditingWord] = useState(null);
	const [editingListName, setEditingListName] = useState(null);
  const [newWord, setNewWord] = useState({
    spanish: '',
    english: '',
    exampleSentence: ''
  });
  
//additional state to export list
const handleExport = (list) => {
  if (!list?.name || !list?.words) return;
  const exportData = {
    name: list.name,
    words: list.words
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${list.name.replace(/\s+/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

//handle import list
const handleImport = async (event) => {
  const file = event.target.files[0];
  const token = getToken();
  if (!file || !token) return;

  try {
    const text = await file.text();
    const importData = JSON.parse(text);
    
    // Create new list
    const newList = await createList(importData.name, getToken);
        
    // Clean and import words
    for (const word of importData.words) {
      const cleanWord = {
        spanish: word.spanish,
        english: word.english,
        exampleSentences: word.exampleSentences.map(s => ({
          spanish: s.spanish,
          english: s.english
        })),
        srs: {
          interval: word.srs.interval,
          ease: word.srs.ease,
          due: word.srs.due,
          reviews: word.srs.reviews
        },
        listId: newList._id
      };
      await addWord(cleanWord, getToken);
    }
    
    setLists(prev => [...prev, newList]);
    setCurrentListId(newList._id);
  } catch (error) {
    console.error('Import error:', error);
    setError('Failed to import list');
  }
};

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (window.location.hash || window.location.search.includes('code=')) {
          setAuthState(prev => ({ ...prev, isLoading: true }));
          await handleAuthentication();
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        const authStatus = isAuthenticated();
        setAuthState({
          isAuthenticated: authStatus,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error('Authentication error:', err);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication failed. Please try again.'
        });
      }
    };

    initializeAuth();
  }, []);

  const getToken = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    return token;
  }, []);

  const handleLogin = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await login();
    } catch (err) {
      console.error('Login error:', err);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to start login process'
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      setCurrentList(null);
      setCurrentListId(null);
      setLists([]);
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.clear();
      window.location.reload();
    }
  };

  // List management functions
const handleCreateList = async (name) => {
  if (!name?.trim()) return;
    try {
      const newList = await createList(name, getToken);
      setLists(prev => [...prev, newList]);
      setCurrentListId(newList._id);
      setError(null);
      setNewListName('');
    } catch (err) {
      console.error('Failed to create list:', err);
      setError('Failed to create list');
    }
  };

	const handleListChange = (listId) => {
  	if (!listId) return;
  	setCurrentListId(listId);    
  	setShowManagement(false);
    setSessionWords([]);
    setCurrentWord(null);
    setMessage('');
    setUserInput('');
    initializeSession(listId);
  };

  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await deleteList(listId, getToken);
        setLists(prev => prev.filter(list => list._id !== listId));
        if (currentListId === listId) {
          setCurrentListId(lists[0]?._id || null);
        }
        setError(null);
      } catch (err) {
        setError('Failed to delete list');
        console.error(err);
      }
    }
  };
	// Rename list function
	
const handleRenameList = async (listId, newName) => {
  if (!currentList || !listId || !newName?.trim()) return;
    try {
    await renameList(listId, newName, getToken);
    setLists(prev => prev.map(list => 
      list._id === listId ? { ...list, name: newName } : list
    ));
    setEditingListName(null);
  } catch (err) {
    setError('Failed to rename list');
    console.error(err);
  }
};

  // Word management functions
  const handleAdd = async (e) => {
  e.preventDefault();
  if (!currentList || !newWord.spanish || !newWord.english || !newWord.exampleSentence) return;

  try {
    const wordData = {
      listId: currentList._id,
        spanish: newWord.spanish,
        english: newWord.english,
        exampleSentences: [{
          spanish: newWord.exampleSentence.replace(newWord.spanish, '_____'),
          english: newWord.exampleSentence
        }],
        srs: {
          interval: 1,
          ease: 2.5,
          due: new Date(),
          reviews: 0
        }
      };

      await addWord(wordData, getToken);
      const words = await getWordsForList(currentListId, getToken);
      setCurrentList(prev => ({ ...prev, words }));
      setNewWord({ spanish: '', english: '', exampleSentence: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add word');
      console.error(err);
    }
  };

  const handleEdit = (word) => {
  if (!currentList) return;
  setEditingWord(word);
  setNewWord({
    spanish: word.spanish,
    english: word.english,
    exampleSentence: word.exampleSentences[0].english
  });
};

  const handleUpdate = async (e) => {
  e.preventDefault();
  if (!currentList || !editingWord || !newWord.spanish || !newWord.english || !newWord.exampleSentence) return;

    try {
      const updatedData = {
        spanish: newWord.spanish,
        english: newWord.english,
        exampleSentences: [{
          spanish: newWord.exampleSentence.replace(newWord.spanish, '_____'),
          english: newWord.exampleSentence
        }]
      };

      await updateWord(editingWord._id, updatedData, getToken);
      const words = await getWordsForList(currentListId, getToken);
      setCurrentList(prev => ({ ...prev, words }));
      setEditingWord(null);
      setNewWord({ spanish: '', english: '', exampleSentence: '' });
      setError(null);
    } catch (err) {
      setError('Failed to update word');
      console.error(err);
    }
  };

  // Load lists when authenticated
  useEffect(() => {
    const loadLists = async () => {
      if (!authState.isAuthenticated) return;
      
      try {
        console.log('Loading lists...');
        const token = getToken();
        const userLists = await getLists(() => token);
        console.log('Lists loaded:', userLists);
        
        setLists(userLists);
        if (userLists.length > 0 && !currentListId) {
          setCurrentListId(userLists[0]._id);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load lists:', err);
        setError('Failed to load lists. Please try refreshing the page.');
        
        if (err.message.includes('401') || err.message.includes('token')) {
          handleLogout();
        }
      }
    };

    loadLists();
  }, [authState.isAuthenticated, getToken]);

  // Load list words when current list changes
  useEffect(() => {
	const loadListWords = async () => {
	console.log('loadListWords called with:', {
      currentListId,
      isAuthenticated: authState?.isAuthenticated,
      listsLength: lists?.length
    });
    
  if (!currentListId || !authState?.isAuthenticated || !lists?.length) return;
      
     try {
      console.log('Loading words for list:', currentListId);
      const words = await getWordsForList(currentListId, getToken);
      console.log('Got words from API:', words);
      const list = lists.find(l => l._id === currentListId);
      console.log('Found list:', list);
      if (list) {
        console.log('Setting current list with words');
        setCurrentList({ ...list, words });
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load words:', err);
      setError('Failed to load words for this list');
    }
  };

  loadListWords();
  }, [currentListId, lists, authState.isAuthenticated, getToken]);

  // Your existing helper functions
  const calculateNextReview = (word, isCorrect) => {
  if (!word?.srs) return null;
    const { interval, ease, reviews } = word.srs;
    let newInterval, newEase, newReviews;

    if (isCorrect) {
      if (reviews === 0) newInterval = 1;
      else if (reviews === 1) newInterval = 6;
      else newInterval = Math.round(interval * ease);
      newEase = ease + 0.1;
      newReviews = reviews + 1;
    } else {
      newInterval = 1;
      newEase = Math.max(1.3, ease - 0.2);
      newReviews = 0;
    }

    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + newInterval);

    return {
      interval: newInterval,
      ease: newEase,
      due: nextDue,
      reviews: newReviews
    };
  };

const initializeSession = (listId = currentListId) => {
  console.log('initializeSession called with:', {
    listId,
    currentListId,
    currentList,
    hasWords: currentList?.words ? 'yes' : 'no'
  });
  
  if (!currentList || !currentList.words) {
    console.log('No list or words available for session:', {
      currentList,
      words: currentList?.words
    });
    return;
  }
  
  const dueWords = currentList.words.filter(word => {
    const dueDate = new Date(word.srs.due);
    return dueDate <= new Date();
  });

  console.log('Due words:', dueWords);

  const wordModes = dueWords.flatMap(word => [
    { ...word, mode: 'translation', completed: false },
    { ...word, mode: 'sentence', completed: false }
  ]);

  console.log('Word modes created:', wordModes);

  for (let i = wordModes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordModes[i], wordModes[j]] = [wordModes[j], wordModes[i]];
  }

  console.log('Setting session words to:', wordModes);
  setSessionWords(wordModes);
  setStats(prev => ({
    ...prev,
    remaining: wordModes.length,
    dueToday: dueWords.length
  }));
};

const selectNextWord = () => {
  console.log('selectNextWord details:', {
    sessionWords: sessionWords?.length,
    currentWord,
    hasUncompleted: sessionWords?.filter(word => !word.completed)?.length
  });
  
  if (!sessionWords?.length) {
    console.log('No session words length');
    setCurrentWord(null);
    setMessage('No words available');
    return;
  }
  
  const uncompleted = sessionWords.filter(word => !word.completed);
  console.log('Uncompleted words:', uncompleted);
  if (uncompleted.length === 0) {
    setCurrentWord(null);
    setMessage('Session complete! All due words practiced.');
    return;
  }

  const nextWord = uncompleted[Math.floor(Math.random() * uncompleted.length)];
  console.log('Selected next word:', nextWord);
  setCurrentWord(nextWord);
  setUserInput('');
  setMessage('');
};

useEffect(() => {
  if (!showManagement && currentListId) {
    initializeSession();
  }
}, [showManagement, currentListId]);

useEffect(() => {
	console.log('sessionWords effect triggered:', sessionWords);
  if (sessionWords && sessionWords.length > 0 && !currentWord) {
   console.log('Calling selectNextWord');
    selectNextWord();
  }
}, [sessionWords]);

useEffect(() => {
  console.log('showCelebration changed to:', showCelebration);
}, [showCelebration]);

  const handleKeyPress = (e) => {
    if (!e?.key || e.key !== 'Enter' || isInputCooldown) return;
      setIsInputCooldown(true);
      setTimeout(() => setIsInputCooldown(false), 200);
      if (message) selectNextWord();
      else if (userInput?.trim()) checkAnswer();
  };

const calculateLevenshteinDistance = (a, b) => {
  const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }
  return matrix[b.length][a.length];
};

const checkAnswer = async () => {
  if (!currentWord?.spanish || !currentList || !sessionWords?.length || !userInput?.trim()) {
    console.log('Missing required data for check answer');
    return;
  }
    
  const distance = calculateLevenshteinDistance(
    userInput.toLowerCase().trim(),
    currentWord.spanish.toLowerCase()
  );
  const isCorrect = distance <= 1;  // Allow one character difference
    
  const updatedSessionWords = sessionWords.map(word => {
    if (word._id === currentWord._id && word.mode === currentWord.mode) {
      return { ...word, completed: true };
    }
    return word;
  });

  const otherModeCompleted = updatedSessionWords.find(
    word => word._id === currentWord._id && 
           word.mode !== currentWord.mode && 
           word.completed
  );

  if (otherModeCompleted) {
    try {
      const updatedSrs = calculateNextReview(currentWord, isCorrect);
      await updateWord(currentWord._id, { srs: updatedSrs }, getToken);
      
      setCurrentList(prev => ({
        ...prev,
        words: prev.words.map(word => {
          if (word._id === currentWord._id) {
            return { ...word, srs: updatedSrs };
          }
          return word;
        })
      }));
    } catch (err) {
      console.error('Failed to update word SRS:', err);
    }
  }
  
  setSessionWords(updatedSessionWords);
  setStats(prev => ({
    ...prev,
    correct: prev.correct + (isCorrect ? 1 : 0),
    incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    remaining: updatedSessionWords.filter(w => !w.completed).length
  }));

  setMessage(isCorrect ? 'Correct!' : `Incorrect. The answer is: ${currentWord.spanish}`);

  if (isCorrect) {
    setShowCelebration(true);
    setCountdown(1);
    setTimeout(() => {
      selectNextWord();
      setCountdown(null);
    }, 1000);
  }
};

  // Loading state
  if (authState.isLoading) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // Unauthenticated state
if (!authState.isAuthenticated) {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }}>
      <h1 style={{ 
        fontSize: window.innerWidth <= 768 ? '24px' : '32px',
        marginBottom: window.innerWidth <= 768 ? '10px' : '0',
        textAlign: 'center'
      }}>Language Learning App</h1>
        {authState.error && (
          <div style={{
            color: '#ff6b6b',
            backgroundColor: '#2d2d2d',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {authState.error}
          </div>
        )}
        <button
          onClick={handleLogin}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          Log In to Start Learning
        </button>
      </div>
    );
  }

if (!lists || lists.length === 0) {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <h2>Welcome! Create your first list to get started.</h2>
      <div style={{
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#2d2d2d',
        borderRadius: '8px'
      }}>
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
          onClick={() => handleCreateList(newListName)}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New List
        </button>
      </div>
    </div>
  );
}

  // Main authenticated UI
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Language Learning App</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Log Out
          </button>
          
{lists?.length > 0 && (
  <select
    value={currentListId || ''}
    onChange={(e) => e?.target?.value && handleListChange(e.target.value)}
    style={{
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #444',
      backgroundColor: '#333',
      color: '#fff'
    }}
  >
    {lists?.map(list => (
      <option key={list?._id} value={list?._id}>
        {list?.name}
      </option>
    ))}
  </select>
)}
{currentListId && (
  <button
    onClick={() => setShowManagement(!showManagement)}
    style={{
      backgroundColor: '#6c757d',
      color: 'white',
      padding: window.innerWidth <= 768 ? '6px 12px' : '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: window.innerWidth <= 768 ? '14px' : '16px',
    whiteSpace: 'nowrap'
  }}
>
  {showManagement ? 'Switch to Quiz Mode' : 'Manage Words'}
</button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

    {(currentList || lists.length === 0) && (showManagement || lists.length === 0) ? (
  <>
    <div style={{
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#2d2d2d',
      borderRadius: '8px'
    }}>
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
      <div style={{ 
  display: 'flex', 
  gap: '10px', 
  alignItems: 'center',
  flexWrap: 'wrap',
  width: window.innerWidth <= 768 ? '100%' : 'auto'
}}>
  <button
    onClick={() => handleCreateList(newListName)}
    style={{
      backgroundColor: '#28a745',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}
  >
    Create New List
  </button>
  <button
    onClick={() => currentList && handleExport(currentList)}
    style={{
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}
    disabled={!currentList}
  >
    Export List
  </button>
  <button
    onClick={() => {
      if (currentList && window.confirm('Delete this list and all its words?')) {
        deleteList(currentList._id, getToken)
          .then(() => {
            setLists(prev => prev.filter(l => l._id !== currentList._id));
            setCurrentListId(null);
          })
          .catch(err => {
            setError('Failed to delete list');
            console.error(err);
          });
      }
    }}
    style={{
      backgroundColor: '#6c757d',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }}
    disabled={!currentList}
  >
    Delete List
  </button>
      </div>
    </div>

    <div>
<h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
  {currentList && editingListName === currentList._id ? (
            <>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onBlur={() => {
                handleRenameList(currentList._id, newListName);
                setEditingListName(null);
              }}
              onKeyPress={(e) => {
  if (!e?.key || e.key !== 'Enter' || !currentList?._id || !newListName?.trim()) return;
  handleRenameList(currentList._id, newListName);
  setEditingListName(null);
}}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#333',
                color: '#fff'
              }}
              autoFocus
            />
            <button
              onClick={() => setEditingListName(null)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            Word Management - {currentList?.name}  
      <button
        onClick={() => {
          if (!currentList) return;
          setEditingListName(currentList._id);
          setNewListName(currentList.name);
        }}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Rename
            </button>
          </>
        )}
      </h2>

      <form onSubmit={(e) => {
  e.preventDefault();
  if (!currentList) return;
  editingWord ? handleUpdate(e) : handleAdd(e);
}} style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>
          {editingWord ? 'Edit Word' : 'Add New Word'}
        </h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Spanish Word:</label>
          <input
            type="text"
            value={newWord.spanish}
            onChange={(e) => setNewWord({ ...newWord, spanish: e?.target?.value || '' })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#333',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>English Translation:</label>
          <input
            type="text"
            value={newWord.english}
            onChange={(e) => setNewWord({ ...newWord, english: e?.target?.value || '' })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#333',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Example Sentence (using the Spanish word):
          </label>
          <input
            type="text"
            value={newWord.exampleSentence}
            onChange={(e) => setNewWord({ ...newWord, exampleSentence: e?.target?.value || '' })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#333',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {editingWord ? 'Update Word' : 'Add Word'}
          </button>

          {editingWord && (
            <button
              type="button"
              onClick={() => {
                setEditingWord(null);
                setNewWord({ spanish: '', english: '', exampleSentence: '' });
              }}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div>
  <h3 style={{ marginBottom: '15px' }}>Word List</h3>
  {currentList && currentList.words && currentList.words.map(word => (
    <div
      key={word._id}
      style={{
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
        backgroundColor: '#2d2d2d'
      }}
    >
            <div style={{ marginBottom: '10px' }}>
              <strong>{word.spanish}</strong> - {word.english}
            </div>
            <div style={{ marginBottom: '10px', fontSize: '0.9em', color: '#666' }}>
              Example: {word.exampleSentences[0].english}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleEdit(word)}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
) : currentList && (
  <>
    {sessionWords && sessionWords.length === 0 ? (
      <div style={{
        padding: '20px',
        backgroundColor: '#2d2d2d',
        borderRadius: '8px',
        color: '#fff',
        marginBottom: '20px',
        border: '1px solid #333'
      }}>
        <p>No words due for review in {currentList?.name || 'this list'}!</p>
        <button
  onClick={() => {
    if (!currentList?.words) {
      console.log('No words in current list');
      return;
    }
    console.log('Current list words:', currentList.words);
    const allWords = currentList.words.map(word => ({
      ...word,
      mode: 'translation',
      completed: false
    }));
    console.log('Mapped session words:', allWords);
    setSessionWords(allWords);
  }}
  style={{
    backgroundColor: '#66afff',
    color: 'white',
    padding: '6px 9px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
  }}
>
          Practice Anyway
        </button>
      </div>
    ) : (
      <>
        <div style={{ 
          border: '1px solid #333',
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#2d2d2d'
        }}>
          <p style={{ 
  marginBottom: '10px',
  fontFamily: 'BackToBlack',
  fontSize: '32px',
  letterSpacing: '1px'
}}>
  {currentWord && (currentWord.mode === 'translation' 
    ? currentWord.english
    : currentWord?.exampleSentences?.[0]?.spanish?.split('_____')?.map((part, index, array) => (
        <React.Fragment key={index}>
          {part}
          {index < array.length - 1 && (
            <span style={{ 
              fontFamily: 'Arial',
              fontSize: '24px',
              letterSpacing: '-2px'
            }}>
              _____
            </span>
          )}
        </React.Fragment>
      ))
)}
</p>

          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type the Spanish word..."
            style={{ 
              width: '100%',
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#333',
              color: '#fff',
              outline: 'none',
              opacity: isInputCooldown ? 0.7 : 1
            }}
            autoFocus
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={checkAnswer}
              disabled={!userInput.trim() || message}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: (!userInput.trim() || message) ? 0.65 : 1
              }}
            >
              Check Answer
            </button>

            {currentWord && message && !message.includes('Correct') && (
              <button 
                onClick={selectNextWord}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Next Word
              </button>
            )}
          </div>

          {console.log('Render check - showCelebration is:', showCelebration)}
          {showCelebration && (
            <CelebrationAnimation 
              onComplete={() => {
                console.log('Animation complete callback fired');
                setShowCelebration(false);
              }} 
            />
          )}
        </div>

        {message && (
          <div style={{
            padding: '10px',
            backgroundColor: message.includes('Session complete!') ? '#2d4d38' : 
              message.includes('Correct') ? '#2d4d38' : '#4d2d2d',
            borderRadius: '4px',
            color: '#fff',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid ' + (
              message.includes('Session complete!') ? '#375a43' : 
              message.includes('Correct') ? '#375a43' : '#5a3737'
            )
          }}>
            <span>{message}</span>
            {countdown !== null && (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px'
              }}>
                {countdown}
              </div>
            )}
          </div>
        )}

        <div style={{
          padding: '15px',
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          marginTop: '20px',
          border: '1px solid #333'
        }}>
         <h2 style={{ marginBottom: '10px', fontSize: '1.2em' }}>
  {currentList?.name} - Session Progress
</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <p>Correct: {stats.correct}</p>
              <p>Incorrect: {stats.incorrect}</p>
            </div>
            <div>
  <p>Words Due Today: {stats?.dueToday || 0}</p>
  <p>Remaining: {stats?.remaining || 0}</p>
  <p>Current Mode: {currentWord?.mode === 'translation' ? 'Translation' : 'Fill in Blank'}</p>
			</div>
          </div>
        </div>
      </>
    )}
  </>
)}
  </div>
);
};
export default App;