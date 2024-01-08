///////////////////////
// Import Dependencies
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')
require('dotenv').config()
const methodOverride = require('method-override')
const passport = require('passport')

require('../config/passport')



///////////////////////
// Middleware Function
const middleware = (app) => {
  app.use(methodOverride('_method'))
  app.use(morgan('tiny'))
  app.use(express.static('utes'))
  app.use(express.json())
  
  app.use(
    session({
      secret: process.env.SECRET,
      store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL
      }),
      saveUninitialized: true,
      resave: false
    })
  )    
}

///////////////////
//Export Middleware
module.exports = middleware