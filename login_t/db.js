require('dotenv').config();

// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const app = express();

// Connection URL
const mguser = process.env.MG_USERNAME;
const mgpass = process.env.MG_PASSWORD;

// test connection with .env variables
// console.log(mguser, mgpass); 

const uri = `mongodb+srv://${mguser}:${mgpass}@cluster0.uwijlbo.mongodb.net/?retryWrites=true&w=majority`; // MongoDB server URL
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then((result) => {

    console.log('connected to db.')
    app.listen(3000);
    
  })
  .catch((err) => console.log(err));


mongoose.disconnect()

