var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var User = require('./models/User.js')
var auth = require('./auth.js')
var Post = require('./models/Post.js')

mongoose.Promise = Promise



app.use(cors())
app.use(bodyParser.json())

app.get('/posts', ay (req,res) => {
  var author = '5bae43bffcd88811ad90a287'
	var posts = await Post.find({author})
  res.send(posts)
})

app.post('/post',(req,res) => {
     var postData = req.body
      postData.author = '5bae43bffcd88811ad90a287'
           
           var post = new Post(postData)
        
    post.save((err, result) => {
          if (err) {
            
            console.error('saving post error')
             return res.status(500).send({message: 'saving post error'})
          }
          res.sendStatus(200)
      })

})

app.get('/users', async(req,res) => {
   try{
    var users = await User.find({}, '-pwd -__v')
    res.send(users)
   }catch (error) {
    console.error(error)
    res.sendStatus(500)
   }
  
})

app.get('/profile/:id', async(req,res) => {
     try{
      var user = await User.findById(req.params.id, '-pwd -__v')
      res.send(user)
      }catch (error) {
      console.error(error)
      res.sendStatus(200)
    }
  })
  
app.use('/auth', auth)

     
mongoose.connect('mongodb://user:password@ds113873.mlab.com:13873/asshpak', {useNewUrlParser: true }, (err) => {
  console.log('error',err);
});


app.listen(3000)