const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (req, res, next) => {
  Note.find({})
    .then((notes) => {
      res.json(notes);
    })
    .catch((err) => next(err));
});

notesRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

notesRouter.post("", (req, res, next) => {
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
    .catch((err) => next(err));
});

notesRouter.put("/:id", (req, res, next) => {
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
    .catch((err) => next(err));
});

notesRouter.delete("/:id", (req, res, next) => {
  Note.deleteOne({ _id: req.params.id })
    .then((deletedNote) => {
      console.log(deletedNote);
      res.status(204).end();
    })
    .catch((err) => next(err));
});

module.exports = notesRouter;
