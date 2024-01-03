///////////////////////
// Import Dependencies 

require('dotenv').config() // Load my ENV file's variables
const mongoose = require('mongoose');

// This is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL;


console.log(' THIS IS DATABASE URL INSIDE utes/connection.js:', DATABASE_URL); //REMOVE THIS BEFORE COMMITING

// Here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Establish our database connection
mongoose.connect(DATABASE_URL, CONFIG);

// Tell mongoose what to do with certain events
// What happens when we open, disconnect, or get an error
mongoose.connection
    .on('open', () => console.log('Connected to Mongoose'))
    .on('close', () => console.log('Disconnected from Mongoose'))
    .on('error', (err) => console.log('An error occurred: \n', err))