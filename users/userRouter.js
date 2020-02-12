const express = require('express');
const Users = require('./userDb');
const router = express.Router();

router.post('/', (req, res) => {
  //adds new user
const newUser = req.body;
Users.insert(req.body)
.then(added=>{
  res.status(201).json(added)
})
.catch(err=>{
  console.log('posting Post error',err)
  res.status(500).json({error:"could not add new user "})
})

});

router.post('/:id/posts', (req, res) => {
//adds post for selected user ID
const newPost = req.body;
const {id}=req.params;
Users.getById(id)
.then(userID =>{
  if(!userID){
    res.status(404).json({error:"no user with that ID found"})
    // res.status(200).json(userID)
  } else {
    Users.insert(newPost)
    .then(post =>{
      res.status(201).json(newPost)
    })
    .catch(err=>{
      console.log(err)
      res.status(500).json({error:"unable to add post"})
    })
  }
})
.catch(err=>{
  console.log(err)
  res.status(500).json({error:"Post information unavailable."})
})

});

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

router.get('/:id', (req, res) => {
  //gets user by ID
  const {id}=req.params
  Users.getById(id)
  .then(user=>{
    res.status(200).json(user)
  })
  
  .catch(err=>{
    console.log(err)
    res.status(500).json({error:"user with specified ID not found"})
  })

});

router.get('/:id/posts', (req, res) => {
  //get all posts from specific user
const {id}=req.params;

Users.getById(id)
.then(user=>{
if(!user){
res.status(404).json({error:"user with that ID not found"})
} else{
  Users.getUserPosts(id)
  .then(userPosts=>{
    res.status(200).json(userPosts)
  })
  .catch(err=>{
    console.log(err)
    res.status(400).json({error:"unable to retrieve posts by specified user"})
  })
} //end of if/else block

})
.catch(err=>{
  console.log(err)
  res.status(500).json({error:"Posts could not be retrieved"})
})

});

router.delete('/:id', (req, res) => {
  //deletes user by id
const {id} = req.params;
const deleteUser = req.body;
 Users.remove(id)
 .then(user=>{
if (!user){
  res.status(404).json({error:"user with specified ID does not exist"})
} else{
  res.status(200).json({deleteUser})
}
 })
 
 .catch(err=>{
   console.log(err)
   res.status(500).json({error:"Unable to delete user"})
 })
});

router.put('/:id', (req, res) => {
  //edit user by id
const editUser =req.body
const {id}=req.params

Users.update(id, editUser)
.then(editing=>{
  // if(!editUser.name){
  //   res.status(400).json({error:"user with specified ID not found"})
  // }else{
    res.status(201).json(editUser)
  // }
})

.catch(err=>{
  console.log(err)
  res.status(500).json({error:"user information could not be edited"})
})

});

//custom middleware

function validateUserId(req, res, next) {

  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
