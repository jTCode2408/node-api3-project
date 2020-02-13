const express = require('express');
const Users = require('./userDb');
const Posts = require('..posts/postDb');
const router = express.Router();
router.use(express.json())
router.post('/', validateUser, (req, res) => {
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
//adds post for selected user ID
const newPost = req.body;
newPost.user_id = req.params.id;
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
  const {id}=req.params
  Users.getById(id)
  .then(
    res.status(200).json(req.user)
  )
  
  .catch(err=>{
    console.log(err)
    res.status(500).json({error:"user with specified ID not found"})
  })

});

router.get('/:id/posts',validateUserId, (req, res) => {
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

router.delete('/:id',validateUserId, (req, res) => {
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

router.put('/:id', validateUserId, validateUser,(req, res) => {
  //edit user by id
const editUser =req.body
const {id}=req.params
Users.update(id, editUser)
.then(userEditing=>{
  if(userEditing){
    if(editUser.name){
    res.status(200).json(editUser)
    }else{
    res.status(400).json({error:"please add name for user"})
  }
}else{
  res.status(400).json({error:"cannot find user with specified ID"})
}
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
const body = req.body;
const keys =Object.keys(body);
if(keys.length===0){
  res.status(400).json({error:"no user data found"})
} if(!body.name){
  res.status(400).json({error:"missing name"})

}
next()

}

function validatePost(req, res, next) {
  const body = req.body
  const keys = Object.keys(body);
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
