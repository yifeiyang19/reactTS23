const multer = require('multer')
const mongoose = require('mongoose')
const imageSchema = require('./imageSchema')
const ImageModel = mongoose.model('Image', imageSchema)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

module.exports = app => {
  app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { filename, path } = req.file

    ImageModel.create({ filename, path })
      .then(() => {
        const imageUrl = `/uploads/${filename}`
        res.json({ imageUrl })
      })
      .catch(err => {
        console.log('err', err)
        res.status(500).json({ error: 'Error uploading image' })
      })
  })
}
