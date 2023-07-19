import express from "express";

const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const personId = Number(req.params.id);
  const person = persons.find((person) => person.id === personId);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const contactName = req.body.name;
  const contactNumber = req.body.number;
  const newId = Math.floor(Math.random() * 10000);
  const nameExisits = persons.some((person) => person.name === contactName);

  if (!contactName || !contactNumber) {
    return res.status(400).json({ error: "must include both name and number" });
  }

  if (nameExisits) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newContact = {
    name: contactName,
    number: contactNumber,
    id: newId,
  };

  persons.push(newContact);

  res.status(201).json(newContact);

  console.log(newContact);
});

app.delete("/api/persons/:id", (req, res) => {
  const deleteId = Number(req.params.id);
  const deletePerson = persons.find((person) => person.id === deleteId);

  if (deletePerson) {
    persons = persons.filter((person) => person.id !== deleteId);
    res.status(204).end();
    console.log(deletePerson);
  } else {
    res.status(404).send("person not found");
  }
});

app.get("/api/info", (req, res) => {
  const personsCount = persons.length;
  const receivedTime = new Date();

  console.log(receivedTime);
  res.send(
    `<div><p>Phonebook has info for ${personsCount} people</p><p>${receivedTime}</p></div>`
  );
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
