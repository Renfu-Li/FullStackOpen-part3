import mongoose from "mongoose";

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

if (!password) {
  console.log("password missing");
  process.exit(1);
}

const url = `mongodb+srv://Onlyuser:${password}@cluster0.tvkkei0.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phoneBookSchema);

const saveOne = (name, phoneNumber) => {
  const person = new Person({
    name: name,
    number: phoneNumber,
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${phoneNumber} to phonebook`);

    mongoose.connection.close();
  });
};

const findAll = () => {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  });
};

if (name && phoneNumber) {
  saveOne(name, phoneNumber);
} else {
  findAll();
}

// node mongo.js Renfu2Code Anna 040-123456
