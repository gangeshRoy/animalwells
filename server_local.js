const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const flash = require('connect-flash');
const http = require('http');
var  cors = require('cors');
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token1111']
  };
  app.use(cors(corsOption));
app.use(flash()); // use connect-flash for flash messages stored in session

server = http.createServer(app).listen(8080);

app.use('/', require('./routes/index.js'));
require('./app/routes.js')(app); // load our routes and pass in our app and fully configured passport
console.log('Discover amazing things to do on Animailwells on Port:' + port);

