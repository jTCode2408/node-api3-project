const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();
// router.use(express.json())
router.post('/', validateUser, (req, res) => {
  //get all users
  const newUser = req.body;
    Users.insert(newUser)
      .then(user=>{
          res.status(201).json(user)
        })
     .catch(err=>{
       console.log(err)
      res.status(500).json({message: 'server error'})
     })

});

router.post('/:id/posts',validateUserId, validatePost, (req, res) => {
//adds post for selected user 
const newPost = req.body;
Posts.insert(newPost)
.then(post=>{
  res.status(201).json(post)
})
.catch(err=>{
  console.log(err)
  res.status(500).json({error:"internal server error"})
})
})

router.get('/', (req, res) => {
  //gets all users
  Users.get()
  .then(users=>{
    res.status(200).json(users)
  })
  .catch(err=>{
    console.log(err)
    res.status(500).json({error:'could not get users'})
  })
});
router.get('/:id', validateUserId, (req, res) => {
  //gets user by ID
res.status(200).json(req.user)

});

router.get('/:id/posts',validateUserId, (req, res) => {
  //get all posts from specific user
const {id}=req.params;
  Users.getUserPosts(id)
  .then(userPosts=>{
    res.status(200).json(userPosts)
  })
  .catch(err=>{
    console.log(err)
    res.status(500).json({error:"unable to retrieve posts by specified user"})
  })
});

router.delete('/:id',validateUserId, (req, res) => {
  //deletes user by id
const {id} = req.params;
const deleteUser = req.body;
 Users.remove(id)
 .then(deleted=>{
   res.status(200).json(deleted)
 })
 .catch(err=>{
   console.log(err)
   res.status(500).json({error:"Unable to delete user"})
 })
});

router.put('/:id', validateUserId, validateUser,(req, res) => {
  //edit user by id
const editUser =req.body
const {id}=req.params
Users.update(id, editUser)
.then(userEditing=>{
res.status(201).json(editUser)
})
.catch(err=>{
  console.log(err)
  res.status(500).json({error:"unable to edit user"})
})
});

//custom middleware
function validateUserId(req, res, next) {
// const user = req.user
const {id}=req.params
console.log('validating ID', id) 
Users.getById(id)
.then(user=>{
  req.user=user
  if(user){
  console.log('REQ USER', req.user)
 next()
  }else{
    res.status(400).json({error:"could not validate user ID"})
  } 
})
.catch(err=>{
  console.log(err)
  res.status(500).json({error:"server error"})
})
}
function validateUser(req, res, next) {
  //validates name on users
const body = req.body;
const keys =Object.keys(body);
console.log('validating USer', req.body)
if(keys.length===0){
  res.status(400).json({error:"no user data found"})
} if(!body.name){
  res.status(400).json({error:"missing name"})

}
next()

}

function validatePost(req, res, next) {
  //validates text on posts
  const body = req.body
  const keys = Object.keys(body);
  console.log('ValidatingPOST', req.body)
  if (keys.length === 0){
    return res.status(400).json({message:'no post found'})
  }
  else if (!body.text){
    console.log(body);
    return res.status(400).json({message:'missing text'})
  }
  next();
}

module.exports = router;
