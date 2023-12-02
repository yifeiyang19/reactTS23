const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const auth = require('./src/auth')
const articles = require('./src/articles')
const upload = require('./src/upload')
const user = require('./src/user')

const corsOption = { origin: true, credentials: true, optionsSuccessStatus: 200 }

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors(corsOption))
app.use('/uploads', express.static('uploads'))

auth(app)
articles(app)
upload(app)
user(app)

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  const addr = server.address()
  console.log(`Server listening at http://${addr.address}:${addr.port}`)
})
