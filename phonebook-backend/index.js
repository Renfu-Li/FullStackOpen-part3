import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/phonebook.js";

const app = express();
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

// const requestLogger = (req, res, next) => {
//   console.log("Method: ", req.method);
//   console.log("Path: ", req.path);
//   console.log("Body: ", req.body);
//   console.log("---");
//   next();
// };

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

app.get("/api/persons", (req, res, next) => {
  Person.find({}).then((returnedPersons) => res.json(returnedPersons));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.find({ _id: req.params.id })
    .then((returnedPerson) => res.json(returnedPerson))
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  Person.findOneAndReplace({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findOneAndDelete({ _id: req.params.id })
    .then((deletedPerson) => res.json(deletedPerson))
    .catch((err) => next(err));
});

app.get("/api/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      const receivedTime = new Date();
      const personsCount = count;
      res.send(
        `<div><p>Phonebook has info for ${personsCount} people</p><p>${receivedTime}</p></div>`
      );
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res, next) => {
  res.status(404).json({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
