const redis = require('redis').createClient('6379', '127.0.0.1')
const md5 = require('md5')

let cookieKey = 'sid'

const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const userSchema = require('./userSchema')
const User = mongoose.model('user', userSchema)
const connectionString = 'mongodb://127.0.0.1:27017/books'
const passport = require('passport')

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    req.username = req.user.username
    console.log(req.username + ' Google Auth')
    next()
  } else {
    if (!req.cookies) {
      return res.sendStatus(401)
    }
    let sid = req.cookies[cookieKey]

    if (!sid) {
      return res.sendStatus(401)
    }

    redis.hmget('sessions', sid, function (err, userObj) {
      if (userObj) {
        req.username = userObj[0]
        console.log(req.username + ' logged in')
        next()
      } else {
        return res.sendStatus(401)
      }
    })
  }
}

function login(req, res) {
  mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  let username = req.body.username
  let password = req.body.password

  // need to supply username and password
  if (!username || !password) {
    res.send('No Username or Password')
    return res.sendStatus(400)
  }

  User.findOne({ username: username }, function (err, userObj) {
    if (err) {
      console.log(err)
    } else {
      if (userObj) {
        let hash = md5(userObj.salt + password)
        if (hash === userObj.password) {
          let sid = md5(username)
          redis.hmset('sessions', sid, username)
          const maxAge = 7 * 24 * 60 * 60 * 1000
          res.cookie(cookieKey, sid, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure: true
          })
          res.cookie(cookieKey, sid, { maxAge, httpOnly: true })
          let msg = {
            username: username,
            avatar: userObj.avatar,
            role: userObj.role,
            result: 'success'
          }
          res.send(msg)
        } else {
          res.sendStatus(401)
        }
      } else {
        return res.sendStatus(401)
      }
    }
  })
}

function register(req, res) {
  mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })

  const username = req.body.username
  const password = req.body.password
  const role = req.body.role

  // need to supply username and password
  if (!username || !password) {
    res.send('No Username or Password')
    return res.sendStatus(400)
  }

  User.findOne({ username: username }, function (err, userObj) {
    if (err) {
      console.log(err)
    } else {
      if (userObj) {
        let msg = { username: username, result: 'Username Exists' }
        res.send(msg)
      } else {
        let salt = username + new Date().getTime()
        let hash = md5(salt + password)
        new User({
          username: username,
          created: Date.now(),
          salt: salt,
          role,
          password: hash,
          avatar: '/uploads/default.jpg'
        }).save()

        let msg = { username: username, result: 'success' }
        res.send(msg)
      }
    }
  })
}

function putPassword(req, res) {
  let username = req.username
  mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  User.findOne({ username: username }, function (err, userObj) {
    if (err) {
      console.log(err)
    } else {
      let newPassword = req.body.password
      let salt = username + new Date().getTime()
      let hash = md5(salt + newPassword)

      userObj.password = hash
      userObj.salt = salt
      userObj.save()

      let msg = { username: username, result: 'success' }
      res.send(msg)
    }
  })
}

function logout(req, res) {
  if (req.isAuthenticated()) {
    req.session.destroy()
    req.logout()
    res.status(200).send('OK')
  } else {
    res.clearCookie(cookieKey, { maxAge: 0, httpOnly: true })
    let sid = req.cookies[cookieKey]
    redis.hdel('sessions', sid)
    res.status(200).send('OK')
  }
}

module.exports = app => {
  app.use(bodyParser.json())
  app.use(cookieParser())

  app.use(
    session({
      secret: 'doNotGuessTheSecret',
      resave: false,
      saveUninitialized: true
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
      console.log('Auth is ' + req.isAuthenticated())
      res.redirect('http://localhost:3006/books')
    }
  )
  app.post('/register', register)
  app.post('/login', login)
  app.use(isLoggedIn)
  app.put('/logout', logout)
  app.put('/password', putPassword)
}
