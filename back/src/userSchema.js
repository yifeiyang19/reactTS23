const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  created: {
    type: Date,
    required: [true, 'Created date is required']
  },
  role: {
    type: Number,
    // 0: general user, 1: admin
    default: 0
  },
  salt: {
    type: String,
    required: [true, 'Salt is required']
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
})

module.exports = userSchema
