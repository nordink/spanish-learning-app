// vocabularyLists.js

// Structure for creating a new list
const createNewList = (name, id) => ({
  id,
  name,
  words: []
})

// Get all user lists
export const getUserLists = () => {
  const savedLists = localStorage.getItem('userLists')
  if (!savedLists) {
    // Initialize with an empty default list
    const defaultList = {
      mywords: createNewList('My Words', 'mywords')
    }
    localStorage.setItem('userLists', JSON.stringify(defaultList))
    return defaultList
  }
  return JSON.parse(savedLists)
}

// Save a new list
export const saveNewList = (name) => {
  const lists = getUserLists()
  const id = `list_${Date.now()}`
  lists[id] = createNewList(name, id)
  localStorage.setItem('userLists', JSON.stringify(lists))
  return id
}

// Add a word to a list
export const addWordToList = (listId, word) => {
  const lists = getUserLists()
  if (!lists[listId]) return false
  
  const wordToAdd = {
    id: `word_${Date.now()}`,
    spanish: word.spanish,
    english: word.english,
    exampleSentences: [
      {
        spanish: word.exampleSentence.replace(word.spanish, '_____'),
        english: word.exampleSentence
      }
    ],
    srs: {
      interval: 1,
      ease: 2.5,
      due: new Date().toISOString(),
      reviews: 0
    }
  }

  lists[listId].words.push(wordToAdd)
  localStorage.setItem('userLists', JSON.stringify(lists))
  return true
}

// Get words for a specific list
export const getListWords = (listId) => {
  const lists = getUserLists()
  return lists[listId]?.words || []
}

// Update word in a list
export const updateWordInList = (listId, wordId, updatedWord) => {
  const lists = getUserLists()
  if (!lists[listId]) return false

  const wordIndex = lists[listId].words.findIndex(w => w.id === wordId)
  if (wordIndex === -1) return false

  lists[listId].words[wordIndex] = {
    ...lists[listId].words[wordIndex],
    ...updatedWord
  }

  localStorage.setItem('userLists', JSON.stringify(lists))
  return true
}

// Delete word from a list
export const deleteWordFromList = (listId, wordId) => {
  const lists = getUserLists()
  if (!lists[listId]) return false

  lists[listId].words = lists[listId].words.filter(w => w.id !== wordId)
  localStorage.setItem('userLists', JSON.stringify(lists))
  return true
}

// Delete a list
export const deleteList = (listId) => {
  const lists = getUserLists()
  if (!lists[listId] || listId === 'mywords') return false // Prevent deletion of default list
  
  delete lists[listId]
  localStorage.setItem('userLists', JSON.stringify(lists))
  return true
}

// Export user lists
export const exportUserLists = () => {
  const lists = getUserLists()
  const blob = new Blob([JSON.stringify(lists, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'vocabulary-lists.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}