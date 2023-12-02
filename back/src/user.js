const mongoose = require('mongoose')
const connectionString = 'mongodb://127.0.0.1:27017/books'
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = require('./userSchema')
const User = mongoose.model('user', userSchema)

const updateUserInfo = (req, res) => {
  User.findOne({ username: req.username }, function (err, userObj) {
    if (err) {
      console.log(err)
    } else {
      userObj.avatar = req.body.avatar
      userObj.password = req.body.password
      userObj.save()
      res.send(true)
    }
  })
}

module.exports = app => {
  app.put('/user', updateUserInfo)
}
