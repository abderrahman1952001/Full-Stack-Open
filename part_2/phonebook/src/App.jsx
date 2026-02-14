import { useState, useEffect } from 'react'
import fetchService from './services/fetch'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import Notification from './components/Notification'
import './index.css'



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)


  const handleNewName = (event) => setNewName(event.target.value)
  const handleNewNumber = (event) => setNewNumber(event.target.value)
  const handleFilter = (event) => setFilter(event.target.value)

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const showNotification = (message, className = 'success') => {
    setNotification({ message, className })
    setTimeout(() => setNotification(null), 3000)
  }

  const errorMessage = (error, fallback) =>
    error.response?.data?.error || error.message || fallback


  useEffect(() => {
    fetchService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch((error) => showNotification(errorMessage(error, 'Failed to fetch data from server'), 'error'))
  }, [])

    
  const addName = (event) => {
    event.preventDefault()

    const existing = persons.find(person => person.name === newName)

    if (existing) {
      const ok = window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)
      if (!ok) return 
        
      const updatedPerson = { ...existing, number: newNumber } 

      return fetchService.update(existing.id, updatedPerson)
        .then(returnedPerson => {
        setPersons(prev => prev.map(person => person.id === returnedPerson.id ? returnedPerson : person))
        setNewName('')
        setNewNumber('')
        showNotification(`${newName} updated`)
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            showNotification(`${newName} not found on server`, 'error')
            setPersons(prev => prev.filter(person => person.id !== existing.id))
            return
          }
          showNotification(errorMessage(error, `Failed to update ${newName}`), 'error')
        })
      }

    const newPerson = { 
      name: newName,
      number: newNumber,
    }

    fetchService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        setNewName('')
        setNewNumber('') 
        showNotification(`${newName} added`)
      })
      .catch((error) => showNotification(errorMessage(error, `Failed to add ${newName}`), 'error'))
   
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (!window.confirm(`Delete ${person.name}?`)) return 

    fetchService
      .deletePerson(id)
      .then(() => {
        setPersons(prev => prev.filter(person => person.id !== id))
        showNotification(`${person.name} deleted`)
      })
      .catch((error) => {
          if (error.response?.status === 404) {
            showNotification(`${person.name} already removed from server`, 'error')
            setPersons(prev => prev.filter(person => person.id !== id))
            return
          }
          showNotification(errorMessage(error, `Failed to delete ${person.name}`), 'error')
        })
    }



  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification?.message} className={notification?.className} />
      <Filter 
        filter={filter}
        handleFilter={handleFilter}
      />
      <h3>Add a new</h3>
      <Form 
          addName={addName}
          newName={newName} 
          handleNewName={handleNewName} 
          newNumber={newNumber} 
          handleNewNumber={handleNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={deletePerson} />
    </div>
  )
}

export default App
