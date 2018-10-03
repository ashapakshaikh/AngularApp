var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var User = require('./models/User.js')
var auth = require('./auth.js')
var Post = require('./models/Post.js')
var jwt = require('jwt-simple')


mongoose.Promise = Promise



app.use(cors())
app.use(bodyParser.json())

function checkAuthenticated(req, res, next ) {
  
  if(!req.header('authorization'))
    return res.status(401).send({message:'Unauthorized. Missing Auth Header'})

      var token = req.header('authorization').split(' ')[1]
      
      var payload = jwt.decode(token, '123')

      if(!payload)
        return res.status(401).send({message: 'Unauthorized. Auth Header Invalid'})
         
         req.userId = payload.sub

         next()
}


app.get('/posts/:id', async (req,res) => {
  var author = req.params.id
	var posts = await Post.find({author})
  res.send(posts)
})

app.post('/post',(req,res) => {
     var postData = req.body

      postData.author = req.userId
           
           var post = new Post(postData)
        
    post.save((err, result) => {
          if (err) {
            
            console.error('saving post error')
             return res.status(500).send({message: 'saving post error'})
          }
          res.sendStatus(200)
      })

})

app.get('/users',auth.checkAuthenticated, async(req,res) => {
   try{
    console.log(req.userId)
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
  

app.use('/auth', auth.router)
     
mongoose.connect('mongodb://test:t123456@ds113873.mlab.com:13873/asshpak', {useNewUrlParser: true }, (err) => {
  console.log('error',err);
});


app.listen(3000)