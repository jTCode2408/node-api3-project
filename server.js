const express = require('express');
const helmet = require('helmet')
const server = express();
const router = require('./router')

server.use(express.json());
//routers
server.use('/api', logger, router)
//middleware

// server.use(helmet());
server.use(logger);//use logger globally

//pull in custom middleware
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
