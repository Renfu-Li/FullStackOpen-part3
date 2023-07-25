require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note.js");

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
  });

  newNote
    .save()
    .then((savedNote) => {
      console.log("Document successfully saved: ", savedNote);

      res.json(savedNote);
    })
    .catch((error) => next(error));
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const documentId = req.params.id;
  const { content, important } = req.body;

  Note.findOneAndReplace(
    { _id: documentId },
    { content, important },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.deleteOne({ _id: req.params.id })
    .then((deletedNote) => {
      console.log(deletedNote);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else {
    next(error);
  }
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
