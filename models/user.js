//////////////////////////////
// Our Schema and Dependencies
const mongoose = require('mongoose');

const { Schema, model } = mongoose

////////////////////
//Schema definition

const userSchema = new Schema({
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  avatar: String
}, {
  timestamps: true
});

////////////////////
// create user model
const User = model('User', userSchema)

////////////////////////
// export our connection
module.exports = mongoose.model('User', userSchema);