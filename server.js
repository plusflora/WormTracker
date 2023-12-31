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
const axios = require('axios')


/////////////////
// Import Routers
const UserRouter = require('./controllers/userControllers')

const fetchBusRoutes = require('./utes/busRoutes')
const fetchStopsForRoute = require('./utes/stops')
const fetchEtasForStop = require('./utes/etaBuilder')


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

//page with all routes
app.get('/routes/allroutes', async (req, res) => {
  try {
      const routesData = await fetchBusRoutes();
      const { username, loggedIn, userId } = req.session; // Assuming you store these in the session
      res.render('routes/allroutes', { routes: routesData, username, loggedIn, userId });
  } catch (error) {
      res.status(500).send('Error fetching bus routes');
  }
});

//dynamic page route with all stops per route. so I don't have to make 600k pages
app.get('/stops/:routeId', async (req, res) => {
  const routeId = req.params.routeId;
  const { username, loggedIn, userId } = req.session; // Extract session variables

  try {
    const stops = await fetchStopsForRoute(routeId);
    res.render('routes/stops', { stops: stops, routeId: routeId, username, loggedIn, userId });
  } catch (error) {
    console.error(error);
    // Pass the session variables even in the case of an error
    res.status(500).render('errorPage', { username, loggedIn, userId, error: 'Error fetching stops' });
  }
});

//page for etas
app.get('/stopPage/:stopId', async (req, res) => {
  const { username, loggedIn, userId } = req.session;

  try {
      // Validate the stopId parameter
      const stopId = req.params.stopId;
      if (!stopId) {
          throw new Error("Invalid stop ID");
      }

      // Fetch ETAs
      const etas = await fetchEtasForStop(stopId);
      res.render('routes/eta', { etas, stopId, username, loggedIn, userId }); 
  } catch (error) {
      console.error("Error in /stopPage/:stopId:", error);
      res.status(500).render('errorPage', { username, loggedIn, userId, error: 'Error fetching stops', errorMessage: error.message });
  }
});

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
