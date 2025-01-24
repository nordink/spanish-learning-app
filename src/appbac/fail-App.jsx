import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ListManagement from './components/ListManagement';
import WordManagement from './components/WordManagement';
import { getWordsForList } from './api';

const App = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  
  const [currentList, setCurrentList] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [sessionWords, setSessionWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [showManagement, setShowManagement] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isInputCooldown, setIsInputCooldown] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    remaining: 0,
    dueToday: 0
  });

  const handleListSelect = async (list) => {
    setCurrentList(list);
    const words = await getWordsForList(list._id);
    setVocabulary(words);
    initializeSession();
  };
  
  // Only render app content if authenticated
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
        <h1 style={{ marginBottom: '20px' }}>Spanish Learning App</h1>
        <button
          onClick={() => loginWithRedirect()}
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

  // Main app render
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#1a1a1a',  
      color: '#ffffff',  
      minHeight: '100vh'  
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Spanish Learning App</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
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
        </div>
      </div>

      {/* Main Content */}
      {!currentList ? (
        <ListManagement onSelectList={handleListSelect} />
      ) : (
        <div>
          <button
            onClick={() => setCurrentList(null)}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            Back to Lists
          </button>
          
          