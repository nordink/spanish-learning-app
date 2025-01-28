import React, { useState, useEffect } from 'react';
import lock from './auth/auth0-lock';
import {
  getLists,
  createList,
  deleteList,
  getWordsForList,
  addWord,
  updateWord,
  deleteWord
} from './services/api';
import './fonts.css';

const WordManagement = ({ currentList, onWordUpdate, getToken }) => {
  const [editingWord, setEditingWord] = useState(null);
  const [newWord, setNewWord] = useState({
    spanish: '',
    english: '',
    exampleSentence: ''
  });
  const [error, setError] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newWord.spanish || !newWord.english || !newWord.exampleSentence) return;

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
      onWordUpdate();
      setNewWord({ spanish: '', english: '', exampleSentence: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add word');
      console.error(err);
    }
  };
  
  const handleEdit = (word) => {
    setEditingWord(word);
    setNewWord({
      spanish: word.spanish,
      english: word.english,
      exampleSentence: word.exampleSentences[0].english
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newWord.spanish || !newWord.english || !newWord.exampleSentence) return;

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
      onWordUpdate();
      setEditingWord(null);
      setNewWord({ spanish: '', english: '', exampleSentence: '' });
      setError(null);
    } catch (err) {
      setError('Failed to update word');
      console.error(err);
    }
  };

  const handleDelete = async (wordId) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      try {
        await deleteWord(wordId, getToken);
        onWordUpdate();
        setError(null);
      } catch (err) {
        setError('Failed to delete word');
        console.error(err);
      }
    }
  };
  
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>
        Word Management - {currentList.name}
      </h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={editingWord ? handleUpdate : handleAdd} style={{
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
            onChange={(e) => setNewWord({ ...newWord, spanish: e.target.value })}
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
            onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
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
            onChange={(e) => setNewWord({ ...newWord, exampleSentence: e.target.value })}
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
        
        <div style={{ display: 'flex', gap: '10px' }}>
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
        {currentList.words.map(word => (
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
              <button
                onClick={() => handleDelete(word._id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ListManagement = ({ onCreateList, getToken }) => {
  const [newListName, setNewListName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      await onCreateList(newListName);
      setNewListName('');
      setError(null);
    } catch (err) {
      setError('Failed to create list');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#2d2d2d',
      borderRadius: '8px'
    }}>
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
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
        Create New List
      </button>
    </form>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('id_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    lock.show();
  };

  const handleLogout = () => {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

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
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    remaining: 0,
    dueToday: 0
  });

  useEffect(() => {
    const loadLists = async () => {
      console.log('Starting loadLists function');
      try {
        const token = localStorage.getItem('access_token');
        console.log('Got token:', token ? 'Token received' : 'No token');
        console.log('Fetching lists...');
        const userLists = await getLists(() => token);
        console.log('Lists received:', userLists);
        setLists(userLists);
        if (userLists.length > 0 && !currentListId) {
          setCurrentListId(userLists[0]._id);
        }
        setError(null);
      } catch (err) {
        console.error('Load lists error details:', {
          message: err.message,
          stack: err.stack,
          error: err
        });
        setError('Failed to load lists');
      }
    };

    if (isAuthenticated) {
      loadLists();
    }
  }, [isAuthenticated, currentListId]);

  useEffect(() => {
    const loadListWords = async () => {
      if (!currentListId) return;
      try {
        const words = await getWordsForList(currentListId, getToken);
        const list = lists.find(l => l._id === currentListId);
        setCurrentList({ ...list, words });
        setError(null);
      } catch (err) {
        setError('Failed to load words');
        console.error(err);
      }
    };

    if (currentListId) {
      loadListWords();
    }
  }, [currentListId, lists]);

  const handleCreateList = async (name) => {
    try {
      const newList = await createList(name, getToken);
      setLists(prev => [...prev, newList]);
      setCurrentListId(newList._id);
      setError(null);
    } catch (err) {
      setError('Failed to create list');
      throw err;
    }
  };

  const handleListChange = (listId) => {
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

  const calculateNextReview = (word, isCorrect) => {
    const { interval, ease, reviews } = word.srs;
    let newInterval, newEase, newReviews;

    if (isCorrect) {
      if (reviews === 0) newInterval = 1;
      else if (reviews === 1) newInterval = 6;
      else newInterval = Math .round(interval * ease);
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
    if (!currentList) return;

    const dueWords = currentList.words.filter(word => {
      const dueDate = new Date(word.srs.due);
      return dueDate <= new Date();
    });

    const wordModes = dueWords.flatMap(word => [
      { ...word, mode: 'translation', completed: false },
      { ...word, mode: 'sentence', completed: false }
    ]);

    for (let i = wordModes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordModes[i], wordModes[j]] = [wordModes[j], wordModes[i]];
    }

    setSessionWords(wordModes);
    setStats(prev => ({
      ...prev,
      remaining: wordModes.length,
      dueToday: dueWords.length
    }));
  };

  const selectNextWord = () => {
    const uncompleted = sessionWords.filter(word => !word.completed);

    if (uncompleted.length === 0) {
      setCurrentWord(null);
      setMessage('Session complete! All due words practiced.');
      return;
    }

    const nextWord = uncompleted[Math.floor(Math.random() * uncompleted.length)];
    setCurrentWord(nextWord);
    setUserInput('');
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isInputCooldown) {
      setIsInputCooldown(true);
      setTimeout(() => setIsInputCooldown(false), 200);

      if (message) selectNextWord();
      else if (userInput.trim()) checkAnswer();
    }
  };

  const checkAnswer = async () => {
    if (!currentWord) return;

    const isCorrect = userInput.toLowerCase().trim() === currentWord.spanish.toLowerCase();
    
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
      setCountdown(1);
      setTimeout(() => {
        selectNextWord();
        setCountdown(null);
      }, 1000);
    }
  };

  useEffect(() => {
    if (!showManagement && currentListId) {
      initializeSession();
    }
  }, [showManagement, currentListId]);

  useEffect(() => {
    if (sessionWords.length > 0 && !currentWord) {
      selectNextWord();
    }
  }, [sessionWords]);

  // Handle loading state
  if (isLoading) {
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

  // Render unauthenticated state
  if (!isAuthenticated) {
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
        <h1 style={{ marginBottom: '20px' }}>Language Learning App</h1>
        <div id="auth0-login-container"></div>
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
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Log Out
          </button>
          {lists.length > 0 && (
            <select
              value={currentListId || ''}
              onChange={(e) => handleListChange(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#333',
                color: '#fff'
              }}
            >
              {lists.map(list => (
                <option key={list._id} value={list._id}>
                  {list.name}
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
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
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

      {showManagement ? (
        <>
          <ListManagement 
            onCreateList={handleCreateList}
            getToken={getToken} 
          />
          {currentList && (
            <WordManagement 
              currentList={currentList}
              getToken={getToken}
              onWordUpdate={async () => {
                const words = await getWordsForList(currentListId, getToken);
                setCurrentList(prev => ({ ...prev, words }));
              }}
            />
          )}
        </>
      ) : currentList && (
        <>
          {sessionWords.length === 0 ? (
            <div style={{
              padding: '20px',
              backgroundColor: '#2d2d2d',
              borderRadius: '8px',
              color: '#fff',
              marginBottom: '20px',
              border: '1px solid #333'
            }}>
              No words due for review in {currentList.name}! Add some words or check back later.
            </div>
          ) : currentWord ? (
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
                {currentWord.mode === 'translation' 
                  ? currentWord.english
                  : currentWord.exampleSentences[0].spanish.split('_____').map((part, index, array) => (
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
                }
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

                {message && !message.includes('Correct') && (
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
            </div>
          ) : null}
          
          {message && (
            <div style={{
              padding: '10px',
              backgroundColor: message.includes('Correct') ? '#2d4d38' : '#4d2d2d',
              borderRadius: '4px',
              color: '#fff',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid ' + (message.includes('Correct') ? '#375a43' : '#5a3737')
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
              {currentList.name} - Session Progress
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <p>Correct: {stats.correct}</p>
                <p>Incorrect: {stats.incorrect}</p>
              </div>
              <div>
                <p>Words Due Today: {stats.dueToday}</p>
                <p>Remaining: {stats.remaining}</p>
                <p>Current Mode: {currentWord ? (currentWord.mode === 'translation' ? 'Translation' : 'Fill in Blank') : 'N/A'}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;