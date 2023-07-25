const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { url } = require("./utils/config");
const { errorHandler, unknownEndpoint } = require("./utils/middleware");
const { info, error } = require("./utils/logger");
const notesRouter = require("./controllers/notes");

mongoose
  .connect(url)
  .then(() => {
    info("connecting to MongoDB");
  })
  .catch((err) => error(err.message));

mongoose.set("strictPopulate", false);

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use("/api/notes", notesRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
