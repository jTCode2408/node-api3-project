const express = require('express');
const hemlet = require('helmet')
const server = express();
const userRouter =require('./users/userRouter');
const postRouter =require('./posts/postRouter');
server.use(express.json());
//routers
server.use("/users", logger, userRouter)
server.use("/posts", logger, postRouter)
//middleware

server.use(hemlet());
server.use(logger);//use logger globally

//pull in custom middleware
// function timestamp(req,res,next) { 
//   req.time= Date.now()
// next()
// }
function logger(req, res, next) {
console.log(`used this is method ${req.method}, to this URL ${req.originalUrl}, at this time ` +  Date.now())
next()
}


//routes
server.get('/', logger, (req, res) => {
  console.log('server start res')
  res.send(`<h2>Let's write some middleware!</h2>`);
});




module.exports = server;
