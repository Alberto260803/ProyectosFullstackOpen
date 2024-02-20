// db.js
const mongoose = require('mongoose');

const url = 'mongodb+srv://fullstack${password}@cluster0.aj6yvq4.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Añade algunas personas al iniciar la base de datos
    const initialPersons = [
      { name: 'John Doe', number: '123-456-7890' },
      { name: 'Jane Smith', number: '987-654-3210' },
    ];

    initialPersons.forEach(async (person) => {
      const newPerson = new Person(person);
      await newPerson.save();
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', phonebookSchema);

module.exports = Person;
