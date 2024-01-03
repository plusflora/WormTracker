//////////////////////
// Import Dependencies
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

////////////////
// Create Router 

const router = express.Router()

///////////////////////
// Routes + Controllers

// GET -> SignUp - /users/signup
router.get('/signup', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/signup', { username, loggedIn, userId })
})

// POST -> SignUp - /users/signup
// this function will need to be async, bc we need to use bcrypt
router.post('/signup', async (req, res) => {
  const { username, loggedIn, userId } = req.session
  console.log(req.body)

  const newUser = req.body

  // we need to encrypt the password, which is what we will save to the db
  // bcrypt is an encryption service
  // genSalt creates 'salt rounds' -> puts it through 10 rounds of encrypting
  // this makes the stored password harder to hack(de-encrypt)
  newUser.password = await bcrypt.hash(
      newUser.password, 
      await bcrypt.genSalt(10)
  )

  // we can now create our user
  User.create(newUser)
      .then(user => {
          // the new user will be created and redirected to the login page
          res.redirect('/users/login')
      })
      .catch(err => {
          console.log('error')

          // res.send('something went wrong')
          // using our new error page
          res.redirect(`/error?error=${err}`)
      })
})

// GET -> Login -> /users/login
router.get('/login', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/login', { username, loggedIn, userId })
})

// POST -> Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body


    User.findOne({ username })
        .then(async (user) => {
            if (user) {

                const result = await bcrypt.compare(password, user.password)

                if (result) {

                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                    res.redirect('/')
                } else {
                    res.redirect(`/error?error=something%20wrong%20with%20credentials`)
                }

            } else {
                res.redirect(`/error`)
            }
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})

// GET -> Logout - /users/logout
router.get('/logout', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/logout', { username, loggedIn, userId })
})
// DELETE -> Logout
router.delete('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

////////////////
// Export Router 

module.exports = router