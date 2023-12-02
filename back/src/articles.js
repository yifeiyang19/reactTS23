const mongoose = require('mongoose')
const connectionString = 'mongodb://127.0.0.1:27017/books'
const commentSchema = require('./commentSchema')
const Comment = mongoose.model('Comment', commentSchema)
const articleSchema = require('./articleSchema')
const Article = mongoose.model('Article', articleSchema)

const userSchema = require('./userSchema')
const User = mongoose.model('user', userSchema)

/*
GET /articles/:id?
none. If specificed, :id is a post id or username
{ articles: [ { _id: 1, author: loggedInUser, ... }, { ... } ] }
 */
function getArticles(req, res) {
  // with specified id
  if (req.params.id) {
    Article.findById(req.params.id, function (err, post) {
      // id is a post id
      if (post) {
        res.send({ articles: post })
      } else {
        // id is a username
        Article.find({ author: req.params.id })
          .sort('-date')
          .limit(10)
          .exec(function (err, posts) {
            if (posts) {
              res.send({ articles: posts })
            }
          })
      }
    })
  } else {
    // without id, return current user's posts
    User.findOne({ username: req.username }, function (err, userObj) {
      let currUser = [req.username]
      Article.find({ author: currUser })
        .sort('-date')
        .limit(10)
        .exec(function (err, posts) {
          res.send({ articles: posts })
        })
    })
  }
}

/*
PUT /articles/:id
{ text: message, commentId: optional }
{ articles: [{ _id: 1, author: loggedInUser, ..., comments: [ ... ] }]

{"text": "newComment",
 "commentId": -1}
{"text": "newnewComment",
 "commentId": "619448e16488e0ac19400964"}
{"text": "newArticle"}
 */
function putArticles(req, res) {
  mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  Article.findOne({ _id: req.params.id }, function (err, articleObj) {
    if (err) {
      console.log(err)
    } else {
      if (articleObj) {
        // only update the post body
        if (!req.body.commentId) {
          if (articleObj.author !== req.username) {
            res.send('NOT Your Article')
          } else {
            articleObj.text = req.body.text
            articleObj.save()
            res.send({ articles: [articleObj] })
          }
        } else {
          if (!articleObj.comments) {
            articleObj.comments = []
          }
          // if add new comment
          if (req.body.commentId === -1) {
            let newComment = new Comment({
              title: req.body.title,
              author: req.username,
              date: new Date(),
              body: req.body.text
            })
            articleObj.comments.push(newComment)
            articleObj.save()
            res.send({ articles: [articleObj] })
          } else {
            // update the comment
            articleObj.comments.forEach(comment => {
              if (comment.id === req.body.commentId) {
                if (comment.author === req.username) {
                  comment.body = req.body.text
                  articleObj.save()
                  res.send({ articles: [articleObj] })
                } else {
                  res.send('NOT Your Article')
                }
              }
            })
          }
        }
      } else {
        res.send('Article NOT FOUND')
      }
    }
  })
}

/*
POST /article
{ text: message, image: optional }
{ articles: [{ _id: 1, author: loggedInUser, ..., comments: [] } ] }

{"text": "nihao",
"image": "test"}
 */
function postArticle(req, res) {
  mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })

  let newArticle = new Article({
    author: req.username,
    date: new Date(),
    title: req.body.title,
    text: req.body.text,
    image: req.body.imageUrl,
    comments: []
  })

  console.log('newArticle', newArticle)

  newArticle.save()
  User.findOne({ username: req.username }, function (err, userObj) {
    if (userObj) {
      let currUser = [req.username]
      Article.find({ author: currUser })
        .sort('-date')
        .limit(10)
        .exec(function (err, posts) {
          res.send({ articles: posts })
        })
    }
  })
}

/*
POST /comment
{ text: comment, articleId: id }

response: the single updated article in an array
 */
function postComment(req, res) {
  mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  Article.findOne({ _id: req.body.articleId }, function (err, articleObj) {
    if (err) {
      console.log(err)
    } else {
      if (articleObj) {
        if (!articleObj.comments) {
          articleObj.comments = []
        }
        let newComment = new Comment({
          author: req.username,
          date: new Date(),
          body: req.body.text
        })
        articleObj.comments.push(newComment)
        articleObj.save()
        res.send({ articles: [articleObj] })
      }
    }
  })
}

/*
PUT /comment/:articleId
{ text: comment, commentId: id }

response: the single updated article in an array
 */
function putComment(req, res) {
  mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  Article.findOne({ _id: req.params.articleId }, function (err, articleObj) {
    if (err) {
      console.log(err)
    } else {
      if (articleObj) {
        articleObj.comments.forEach(comment => {
          if (comment.id === req.body.commentId) {
            comment.body = req.body.text
            articleObj.save()
            res.send({ articles: [articleObj] })
          }
        })
      }
    }
  })
}

// GET /mainarticles
function getMainArticles(req, res) {
  console.log('req', req)

  User.findOne({ username: req.username }, function (err, userObj) {
    const users = [userObj.username]
    console.log(users)
    Article.find({ author: { $in: users } })
      .sort('-date')
      .limit(30)
      .exec(function (err, posts) {
        res.send({ articles: posts })
      })
  })
}

module.exports = app => {
  app.get('/articles/:id?', getArticles)
  app.put('/articles/:id', putArticles)
  app.post('/article', postArticle)
  app.post('/comment', postComment)
  app.put('/comment/:articleId', putComment)
  app.get('/mainarticles', getMainArticles)
}
