require('dotenv').config();


// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const User = require('./models/accounts');

const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');

const app = express();
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// body parser middleware
app.use(bodyParser.urlencoded({ extended: true })); 

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const mguser = process.env.MG_USERNAME;
const mgpass = process.env.MG_PASSWORD;
const uri = `mongodb+srv://${mguser}:${mgpass}@cluster0.uwijlbo.mongodb.net/?retryWrites=true&w=majority`; // MongoDB server URL

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Serve the HTML register form
app.get('/', (req, res) => {
  res.render('register', { message: '' });
});

// Handle form submission
app.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
      await saveUser(username, password);
      res.render('register', { message: 'Registration successful! You may now login.' });
  } catch (error) {
      res.render('register', { message: 'Registration error: ' + error.message });
  }
});

// Start the Express.js server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} @ http://localhost:3000/`);
});

async function saveUser(username, password) {
  try {

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new Error("Username already exists.");
    }

    let newUser = new User({ 
      username: username, 
      password: password 
    });

    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser);
    
  } catch (error) {
      console.log('Error saving user:', error.message);
      throw error;
  }
}

