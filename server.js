//////////////////////
// Import Dependencies
const express = require('express') 
require('dotenv').config()
const path = require('path')
const middleware = require('./utes/middleware')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const passport = require('passport')

/////////////////
// Import Routers


//////////////////////////////////////////////////
//create the app object and set up the view engine
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

////////////////
//import routers
//basic home route for testing


////////////
//middleware
middleware(app)

////////
//Routes
app.get('/', (req, res) => {
  const { username, loggedIn, userId } = req.session
  res.render('home.ejs', { username, loggedIn, userId })
})


//error page

/////////////////
//server listener
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('marathons are a bad idea, but here we are.')
})

// console.log('Database URL:', process.env.DATABASE_URL)
