const express = require('express');
const Posts = require('./postDb');
const router = express.Router();
router.use(express.json())

router.get('/', (req, res) => {
//gets all posts
  Posts.get()
  .then(posts=>{
    res.status(200).json(posts)
  })
  .catch(err=>{
    console.log(err)
    res.status(500).json({error:'could not get posts'})
  })
});

router.get('/:id', validatePostId,(req, res) => {
 //get post by id
 const {id}=req.params
 Posts.getById(id)
 .then(post=>{
   res.status(200).json(post)
 })
 
 .catch(err=>{
   console.log(err)
   res.status(500).json({error:"post with specified ID not found"})
 })
});

router.delete('/:id', validatePostId,(req, res) => {
  // delete post by id
  const {id} = req.params;
const deletePost = req.body;
 Posts.remove(id)
 .then(deletedPost=>{
if (!deletedPost){
  res.status(404).json({error:"post with specified ID does not exist"})
} else{
  res.status(200).json({deletePost})
}
 })
 
 .catch(err=>{
   console.log(err)
   res.status(500).json({error:"Unable to delete post"})
 })
});

router.put('/:id', validatePostId, (req, res) => {
  // edits post by POST ID
const {id} = req.params;
const editPost = req.body;
Posts.update(id, editPost)
.then(post=>{
  if(post){
    if(editPost.text){
    res.status(200).json(editPost)
    }else{
    res.status(400).json({error:"please add text for post"})
  }
}else{
  res.status(400).json({error:"cannot find post with specified ID"})
}
})
.catch(err=>{
  console.log(err)
  res.status(500).json({error:"unable to edit post"})
})

});

//add post for user
router.post('/:id/posts', (req,res)=>{
const newPost = req.body;
if(!newPost.text){
    res.status(400).json({errorMessage: "Please provide title and contents for the post." })
} else{
Posts.insert(newPost)
.then(adding =>{
    res.status(201).json(newPost);

})
.catch(err=>{
    console.log(err)
    res.status(500).json({ error: "There was an error while saving the post to the database" })
})
}
})


// custom middleware

function postHeader(req,res,next){
  req.post=post
  next()
}
function validatePostId(req, res, next) {
  const {id}=req.params;
  console.log('validating ID')
  Posts.getById(id)
    if(id){
  res.status(200).json(postHeader)
    }else{
      res.send(400).json({error:"invalid post ID"})
    }
  next()
}

module.exports = router;
