import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB", error.message));

const peronSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d+/.test(v);
      },
      message:
        "Invalid phone number format.Please use the format '##-#' or '###-#'.",
    },
    required: true,
  },
});

peronSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", peronSchema);

export default Person;
