const mongoose = require('mongoose')
const commentSchema = require('./commentSchema')

const articleSchema = new mongoose.Schema({
  author: String,
  title: String,
  text: String,
  date: Date,
  image: String,
  comments: [commentSchema]
})

module.exports = articleSchema
