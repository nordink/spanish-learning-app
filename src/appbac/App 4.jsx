import React, { useState, useEffect } from 'react'
import { vocabularyLists } from './vocabularyLists'
import './fonts.css'

// Word Management Component
function WordManagement({ vocabulary, setVocabulary, currentListId }) {
  const [editingWord, setEditingWord] = useState(null)
  const [newWord, setNewWord] = useState({
    spanish: '',
    english: '',
    exampleSentence: ''
  })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newWord.spanish || !newWord.english || !newWord.exampleSentence) return

    const wordToAdd = {
      id: Date.now(),
      spanish: newWord.spanish,
      english: newWord.english,
      exampleSentences: [
        {
          spanish: newWord.exampleSentence.replace(newWord.spanish, '_____'),
          english: newWord.exampleSentence
        }
      ],
      srs: {
        interval: 1,
        ease: 2.5,
        due: new Date().toISOString(),
        reviews: 0
      }
    }

    setVocabulary([...vocabulary, wordToAdd])
    setNewWord({ spanish: '', english: '', exampleSentence: '' })
  }

  const handleEdit = (word) => {
    setEditingWord(word)
    setNewWord({
      spanish: word.spanish,
      english: word.english,
      exampleSentence: word.exampleSentences[0].english
    })
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    if (!newWord.spanish || !newWord.english || !newWord.exampleSentence) return

    const updatedVocabulary = vocabulary.map(word => {
      if (word.id === editingWord.id) {
        return {
          ...word,
          spanish: newWord.spanish,
          english: newWord.english,
          exampleSentences: [
            {
              spanish: newWord.exampleSentence.replace(newWord.spanish, '_____'),
              english: newWord.exampleSentence
            }
          ]
        }
      }
      return word
    })

    setVocabulary(updatedVocabulary)
    setEditingWord(null)
    setNewWord({ spanish: '', english: '', exampleSentence: '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      setVocabulary(vocabulary.filter(word => word.id !== id))
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>
        Word Management - {vocabularyLists[currentListId].name}
      </h2>
      
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
              border: '1px solid #ccc'
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
              border: '1px solid #ccc'
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
              border: '1px solid #ccc'
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
                setEditingWord(null)
                setNewWord({ spanish: '', english: '', exampleSentence: '' })
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
        {vocabulary.map(word => (
          <div
            key={word.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px'
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
                onClick={() => handleDelete(word.id)}
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
  )
}

function App() {
  const getInitialListId = () => {
    return localStorage.getItem('currentListId') || 'basic'
  }

  const getInitialWords = (listId) => {
    const savedWords = localStorage.getItem(`vocabularyWords_${listId}`)
    return savedWords ? JSON.parse(savedWords) : vocabularyLists[listId].words
  }

  const [currentListId, setCurrentListId] = useState(getInitialListId())
  const [userInput, setUserInput] = useState('')
  const [message, setMessage] = useState('')
  const [sessionWords, setSessionWords] = useState([])
  const [currentWord, setCurrentWord] = useState(null)
  const [vocabulary, setVocabulary] = useState(getInitialWords(currentListId))
  const [showManagement, setShowManagement] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [isInputCooldown, setIsInputCooldown] = useState(false)
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    remaining: 0,
    dueToday: 0
  })

  // Save current list ID
  useEffect(() => {
    localStorage.setItem('currentListId', currentListId)
  }, [currentListId])

  // Save vocabulary for current list
  useEffect(() => {
    localStorage.setItem(`vocabularyWords_${currentListId}`, JSON.stringify(vocabulary))
  }, [vocabulary, currentListId])

  const handleListChange = (listId) => {
    setCurrentListId(listId)
    setVocabulary(getInitialWords(listId))
    setShowManagement(false)
    setSessionWords([])
    setCurrentWord(null)
    setMessage('')
    setUserInput('')
    initializeSession()
  }

  const enableTestMode = () => {
    const testVocabulary = vocabulary.map(word => ({
      ...word,
      srs: {
        ...word.srs,
        due: new Date(Date.now() - 86400000).toISOString()
      }
    }))
    setVocabulary(testVocabulary)
    setShowManagement(false)
    initializeSession()
  }

  const calculateNextReview = (word, isCorrect) => {
    const { interval, ease, reviews } = word.srs
    let newInterval, newEase, newReviews

    if (isCorrect) {
      if (reviews === 0) {
        newInterval = 1
      } else if (reviews === 1) {
        newInterval = 6
      } else {
        newInterval = Math.round(interval * ease)
      }
      newEase = ease + 0.1
      newReviews = reviews + 1
    } else {
      newInterval = 1
      newEase = Math.max(1.3, ease - 0.2)
      newReviews = 0
    }

    const nextDue = new Date()
    nextDue.setDate(nextDue.getDate() + newInterval)

    return {
      interval: newInterval,
      ease: newEase,
      due: nextDue.toISOString(),
      reviews: newReviews
    }
  }

  const initializeSession = () => {
    const dueWords = vocabulary.filter(word => {
      const dueDate = new Date(word.srs.due)
      return dueDate <= new Date()
    })

    const wordModes = dueWords.flatMap(word => [
      { ...word, mode: 'translation', completed: false },
      { ...word, mode: 'sentence', completed: false }
    ])
    
    for (let i = wordModes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[wordModes[i], wordModes[j]] = [wordModes[j], wordModes[i]]
    }
    
    setSessionWords(wordModes)
    setStats(prev => ({ 
      ...prev, 
      remaining: wordModes.length,
      dueToday: dueWords.length
    }))
  }

  const selectNextWord = () => {
    const uncompleted = sessionWords.filter(word => !word.completed)
    if (uncompleted.length === 0) {
      setCurrentWord(null)
      setMessage('Session complete! All due words practiced in both modes.')
      return
    }

    const nextWord = uncompleted[Math.floor(Math.random() * uncompleted.length)]
    setCurrentWord(nextWord)
    setUserInput('')
    setMessage('')
  }

 const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !isInputCooldown) {
    // Prevent rapid consecutive submissions
    setIsInputCooldown(true)
    setTimeout(() => setIsInputCooldown(false), 200) // 200ms cooldown

    if (message) {
      selectNextWord()
    } else if (userInput.trim()) { // Only check if there's actual input
      checkAnswer()
    }
  }
}

  const checkAnswer = () => {
    if (!currentWord) return

    const isCorrect = userInput.toLowerCase().trim() === currentWord.spanish.toLowerCase()
    
    const updatedSessionWords = sessionWords.map(word => {
      if (word.id === currentWord.id && word.mode === currentWord.mode) {
        return { ...word, completed: true }
      }
      return word
    })
    
    const otherModeCompleted = updatedSessionWords.find(
      word => word.id === currentWord.id && 
             word.mode !== currentWord.mode && 
             word.completed
    )

    if (otherModeCompleted) {
      const updatedVocabulary = vocabulary.map(word => {
        if (word.id === currentWord.id) {
          return {
            ...word,
            srs: calculateNextReview(word, isCorrect)
          }
        }
        return word
      })
      setVocabulary(updatedVocabulary)
    }
    
    setSessionWords(updatedSessionWords)
    setStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      remaining: updatedSessionWords.filter(w => !w.completed).length
    }))

    setMessage(isCorrect 
      ? 'Correct!' 
      : `Incorrect. The answer is: ${currentWord.spanish}`
    )

    if (isCorrect) {
      setCountdown(1)
      setTimeout(() => {
        selectNextWord()
        setCountdown(null)
      }, 1000)
    }
  }

  useEffect(() => {
    if (!showManagement) {
      initializeSession()
    }
  }, [showManagement])

  useEffect(() => {
    if (sessionWords.length > 0 && !currentWord) {
      selectNextWord()
    }
  }, [sessionWords])
  
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
        <h1>Learning App</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={currentListId}
            onChange={(e) => handleListChange(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #444',
              backgroundColor: '#333',
              color: '#fff'
            }}
          >
            {Object.values(vocabularyLists).map(list => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          {showManagement ? (
            <button
              onClick={enableTestMode}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test All Words
            </button>
          ) : null}
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
        </div>
      </div>

      {showManagement ? (
        <WordManagement 
          vocabulary={vocabulary} 
          setVocabulary={setVocabulary}
          currentListId={currentListId}
        />
      ) : (
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
              No words due for review in {vocabularyLists[currentListId].name}! Check back later.
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
                fontSize: '24px',
                letterSpacing: '1px'
              }}>
                {currentWord.mode === 'translation' 
                  ? `${currentWord.english}`
                  : currentWord.exampleSentences[0].spanish.split('_____').map((part, index, array) => (
                      <>
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
                      </>
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
              {vocabularyLists[currentListId].name} - Session Progress
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
  )
}

export default App
  