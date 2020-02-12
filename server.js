const express = require('express');
const hemlet = require('helmet')
const server = express();
const userRouter =require('./users/userRouter');
const postRouter =require('./posts/postRouter');

//routers
server.use("/users", userRouter)
server.use("/posts", postRouter)
//middleware
server.use(express.json());
server.use(hemlet());


//pull in custom middleware

function logger(req, res, next) {

}


//routes
server.get('/', (req, res) => {
  console.log('server start res')
  res.send(`<h2>Let's write some middleware!</h2>`);
});




module.exports = server;
