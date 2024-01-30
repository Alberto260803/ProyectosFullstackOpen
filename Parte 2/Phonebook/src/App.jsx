import React, { useState, useEffect } from 'react';
import phonebookService from './services/phonebook';
import './index.css';

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    Filter shown with:{' '}
    <input value={searchTerm} onChange={handleSearchChange} />
  </div>
);

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  addPerson,
}) => (
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
);

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook. Replace the old number with a new one?`
      );
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        phonebookService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response
              )
            );
            setNewName('');
            setNewNumber('');
            setSuccessMessage(`Updated ${response.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(
                `Error updating person: ${error.response.data.error}. Person not found.`
              );
            } else {
              setErrorMessage(
                `Error updating person: ${error.response.data.error}`
              );
            }
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      phonebookService
        .create(newPerson)
        .then((response) => {
          setPersons([...persons, response]);
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`Added ${response.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setErrorMessage(`Error adding person: ${error.response.data.error}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const handleRemove = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (confirmDelete) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setSuccessMessage(`Deleted ${name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setErrorMessage(
              `Error deleting person: ${error.response.data.error}. Person not found.`
            );
          } else {
            setErrorMessage(
              `Error deleting person: ${error.response.data.error}`
            );
          }
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <div>
        {persons
          .filter((person) =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((person) => (
            <div key={person.id}>
              {person.name} {person.number}{' '}
              <button onClick={() => handleRemove(person.id, person.name)}>
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
