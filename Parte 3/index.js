const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Person = require('./db');

const app = express();
app.use(express.json());
app.use(morgan('tiny'));

mongoose
  .connect('mongodb://localhost:27017/phonebook', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', async (request, response) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/persons/:id', async (request, response) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      response.json({
        name: person.name,
        number: person.number,
        id: person._id,
      });
    } else {
      response.status(404).json({ error: 'Person not found' });
    }
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/persons', async (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  try {
    const existingPerson = await Person.findOne({ name: body.name });
    if (existingPerson) {
      return response.status(400).json({ error: 'name must be unique' });
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await newPerson.save();
    response.json(savedPerson);
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/persons/:id', async (request, response) => {
  const body = request.body;

  if (!body.number) {
    return response.status(400).json({ error: 'number is missing' });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { number: body.number },
      { new: true }
    );

    if (updatedPerson) {
      response.json({
        name: updatedPerson.name,
        number: updatedPerson.number,
        id: updatedPerson._id,
      });
    } else {
      response.status(404).json({ error: 'Person not found' });
    }
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/persons/:id', async (request, response) => {
  try {
    await Person.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/info', async (request, response) => {
  try {
    const numberOfEntries = await Person.countDocuments({});
    const requestTime = new Date();
    const infoMessage = `
      <p>Phonebook has info for ${numberOfEntries} people</p>
      <p>${requestTime}</p>
    `;
    response.send(infoMessage);
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
