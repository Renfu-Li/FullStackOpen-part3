import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(express.static("build"));
app.use(cors());
app.use(express.json());

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

const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method);
  console.log("Path: ", req.path);
  console.log("Body: ", req.body);
  console.log("---");
  next();
};

// app.use(requestLogger);

app.use(morgan("tiny"));

// solution1: using format string of predefined tokens
morgan.token("body", function (req, res) {
  const body = JSON.stringify(req.body);

  return body;
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// solution2: using a custom format function
// app.use(
//   morgan(function (tokens, req, res) {
//     const resBody = JSON.stringify(req.body);
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, "content-length"),
//       "-",
//       tokens["response-time"](req, res),
//       "ms",
//       resBody,
//     ].join(" ");
//   })
// );

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

const unknownEndpoint = (req, res, next) => {
  res.status(404).json({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
