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
require('./utes/connection')


/////////////////
// Import Routers
const UserRouter = require('./controllers/userControllers')


//////////////////////////////////////////////////
//create the app object and set up the view engine
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true })); // This needs to be before your route definitions

////////////////
//import routers
//basic home route for testing


////////////
//middleware
middleware(app)

require('./config/passport')
////////
//Routes
app.get('/', (req, res) => {
  const { username, loggedIn, userId } = req.session
  res.render('home.ejs', { username, loggedIn, userId })
})

app.use('/users', UserRouter)

//error page
app.get('/error', (req, res) => {
  const error = req.query.error || 'Ope! Something went wrong...try again'

  const { username, loggedIn, userId } = req.session

  res.send(error)
  // res.render('error.ejs', { error, userId, username, loggedIn })
})

//OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}))

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/')
})
/////////////////
//server listener
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('marathons are a bad idea, but here we are.')
})

// console.log('Database URL:', process.env.DATABASE_URL)
