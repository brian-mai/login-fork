require('dotenv').config();

// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

// Connection URL
const mguser = process.env.MG_USERNAME;
const mgpass = process.env.MG_PASSWORD;

// test connection with .env variables
// console.log(mguser, mgpass); 

const uri = `mongodb+srv://${mguser}:${mgpass}@cluster0.uwijlbo.mongodb.net/?retryWrites=true&w=majority`; // MongoDB server URL
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } );







mongoose.disconnect()

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     await client.connect(); // Connect the client to the server	(optional starting in v4.7)
//     await client.db("admin").command({ ping: 1 });  // Send a ping to confirm a successful connection
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);