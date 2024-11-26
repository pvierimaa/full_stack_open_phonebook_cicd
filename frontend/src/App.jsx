import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Filter = ({ newLetters, handleLetterChange }) => {
  return (
    <div>
      filter shown with
      <input value={newLetters} onChange={handleLetterChange} />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = ({ persons, handleDelete, newLetters }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().startsWith(newLetters.toLowerCase())
  )

  return (
    <div>
      {filteredPersons.map((person) => (
        <Person key={person.name} person={person} handleDelete={handleDelete} />
      ))}
    </div>
  )
}

const Person = ({ person, handleDelete }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className="status">{message}</div>
}

const NotificationError = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className="error">{message}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newLetters, setNewLetters] = useState('')
  const [statusMessage, setStatusMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    const existingPerson = persons.find((person) => person.name === newName)
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(existingPerson.id, personObject)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) => (person.id !== existingPerson.id ? person : updatedPerson))
            )
            setNewName('')
            setNewNumber('')
            setStatusMessage(`Number changed`)
            setTimeout(() => {
              setStatusMessage(null)
            }, 5000)
          })
          .catch((error) => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter((person) => person.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setStatusMessage(`Added ${newName}`)
          setTimeout(() => {
            setStatusMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setErrorMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleLetterChange = (event) => {
    setNewLetters(event.target.value)
  }

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id))
        setStatusMessage(`Removed ${person.name}`)
        setTimeout(() => {
          setStatusMessage(null)
        }, 5000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={statusMessage} />
      <NotificationError message={errorMessage} />
      <Filter newLetters={newLetters} handleLetterChange={handleLetterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} handleDelete={handleDelete} newLetters={newLetters} />
    </div>
  )
}

export default App
