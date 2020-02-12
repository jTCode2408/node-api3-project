const express = require('express');
const Posts = require('./postDb');
const router = express.Router();

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

router.get('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
  // edits post by id



});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
