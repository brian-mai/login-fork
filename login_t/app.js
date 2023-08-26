require('dotenv').config();

// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const User = require('./models/accounts');

// login session w/ cookies
const jwt = require('jsonwebtoken');
const { generateToken } = require('./jwtUtils');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const path = require('path');
const express = require('express');

const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// body parser middleware
app.use(bodyParser.urlencoded({ extended: true })); 
// cookie handler middleware
app.use(cookieParser());

// Middleware to authenticate requests
app.use((req, res, next) => {
  const token = req.cookies.jwtToken; // Get the token from the cookie

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Store the decoded user data in the request object
    } catch (error) {
      console.log('Invalid token:', error.message);
    }
  }
  next(); // move to the next middleware or route handler
});

// protected route that requires authentication
app.get('/profile', (req, res) => {
  if (req.user) {
    // The user is authenticated, so you can access req.user to get their data
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/login'); // Redirect to the login page if not authenticated
  }
});


// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const mguser = process.env.MG_USERNAME;
const mgpass = process.env.MG_PASSWORD;
const uri = `mongodb+srv://${mguser}:${mgpass}@cluster0.uwijlbo.mongodb.net/?retryWrites=true&w=majority`; // MongoDB server URL

// wrapper for mongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Serve the HTML views
app.get('/', (req, res) => {
  if (req.cookies.jwtToken) {
    res.redirect('/profile');
  }
  else {
  res.render('login', { message: '' });
  }
});

app.get('/login', (req, res) => {
  const token = req.cookies.jwtToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // Redirect to the profile page if the token is valid
      res.redirect('/profile');
      return; // Exit the function after redirection
    } catch (error) {
      console.log('Invalid token:', error.message);
    }
  }

  res.render('login', { message: '' }); 
});

app.get('/register', (req, res) => {
  res.render('register', { message: '' });
});

// Handle register
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

// Handle login
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
      await loginUser(username, password, res);
      res.redirect('/profile');
      // res.render('homepage');
  } catch (error) {
      res.render('login', { message: 'Username or password is incorrect.' });
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

async function loginUser(username, password, res) {
  try {
    const matchUser = await User.findOne({ username, password });
    if (matchUser == null) {
      throw new Error("Incorrect login");
    }

    const token = generateToken({ username: username, password: password });
    res.cookie('jwtToken', token, { httpOnly: true, maxAge: 3600000 }); // Set the cookie in the response

  } catch (error) {
    console.log('Error finding user:', error.message);
    throw error;
  }
}


