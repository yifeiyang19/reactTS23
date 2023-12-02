const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: String,
    date: Date,
    body: String
})

module.exports = commentSchema;