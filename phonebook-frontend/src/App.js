import { useState, useEffect } from "react";

import personService from "./services/persons.js";

const Filter = ({ filterCriteria, handleFilter }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={filterCriteria} onChange={handleFilter}></input>
    </div>
  );
};

const AddPerson = ({
  newName,
  handleNameInput,
  newNumber,
  handleNumberInput,
  handleAdd,
}) => {
  return (
    <>
      <h1>Add a new</h1>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameInput} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberInput}></input>
        </div>
        <div>
          <button type="submit" onClick={handleAdd}>
            add
          </button>
        </div>
      </form>
    </>
  );
};

const PersonsNumber = ({ shownNumbers, handleDelete }) => {
  return (
    <>
      <h2>Numbers</h2>
      {shownNumbers.map((person) => (
        <SinglePerson
          key={person.id}
          person={person}
          handleDelete={handleDelete}
        ></SinglePerson>
      ))}
    </>
  );
};

const SinglePerson = ({ person, handleDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </p>
  );
};

const Notification = ({ message, style }) => {
  if (message === null) {
    return null;
  } else {
    console.log(message);

    return <div style={style}>{message}</div>;
  }
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");
  const [filteredPersons, setFilteredPersons] = useState([...persons]);
  const [message, setMessage] = useState(null);

  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    padding: 10,
    marginBottom: 10,
  };

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleFilter = (event) => {
    setFilterCriteria(event.target.value);

    const lowerFilterCritera = event.target.value.toLowerCase();

    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(lowerFilterCritera)
    );

    setFilteredPersons(filteredPersons);
  };

  const handleNameInput = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value);
  };

  const handleAdd = (event) => {
    event.preventDefault();

    const currentNames = persons.map((person) => person.name);

    if (newName === "" || newNumber === "") {
      alert("You must input both Name and Number to add to phonebook");
      return;
    }

    if (currentNames.includes(newName)) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmReplace) {
        const personToUpdate = persons.find(
          (person) => person.name === newName
        );
        const updatedPerson = { ...personToUpdate, number: newNumber };

        personService
          .updatePerson(personToUpdate.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.name === newName ? response.data : person
              )
            );

            setFilteredPersons(
              filteredPersons.map((person) =>
                person.name === newName ? response.data : person
              )
            );

            setMessage(`Contact infomation of ${newName} updated`);
            setTimeout(() => setMessage(null), 3000);
          })
          .catch(() =>
            setMessage(
              `Information of ${newName} has already been removed from server`
            )
          );
      } else return;
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService
        .createPerson(newPerson)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setFilteredPersons(filteredPersons.concat(response.data));

          setMessage(`Added ${newName}`);
          setTimeout(() => setMessage(null), 3000);
        })
        .catch((error) => console.log("Failed adding new person"));
    }

    setNewName("");
    setNewNumber("");
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`);

    if (confirmDelete) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setFilteredPersons(
            filteredPersons.filter((person) => person.id !== id)
          );

          setMessage(`Deleted ${personToDelete.name}`);
          setTimeout(() => setMessage(null), 3000);
        })
        .catch((error) =>
          setMessage(
            `Information of ${personToDelete.name} has already been removed from server`
          )
        );
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} style={notificationStyle}></Notification>
      <Filter
        filterCriteria={filterCriteria}
        handleFilter={handleFilter}
      ></Filter>

      <AddPerson
        newName={newName}
        handleNameInput={handleNameInput}
        newNumber={newNumber}
        handleNumberInput={handleNumberInput}
        handleAdd={handleAdd}
      ></AddPerson>

      <PersonsNumber
        shownNumbers={filterCriteria === "" ? persons : filteredPersons}
        handleDelete={handleDelete}
      ></PersonsNumber>
    </div>
  );
};

export default App;
