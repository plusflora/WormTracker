//////////////////////////////
// Our Schema and Dependencies
const mongoose = require('mongoose');

const { Schema, model } = mongoose

////////////////////
//Schema definition

const userSchema = new Schema({
  username: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true
  }
})

////////////////////
// create user model
const User = model('User', userSchema)

////////////////////////
// export our connection
module.exports = User