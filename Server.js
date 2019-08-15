var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var db_url = "mongodb+srv://abed:abed@cluster0-tvorl.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(db_url, { useNewUrlParser: true });
mongoose.connection.on('error', function (err) {
  console.log(err);
  console.log('Could not connect to mongodb');
})
users = [];
connections = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function(socket){
  
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);


  socket.on('disconnect', function(data){
    updateUsernames();
    console.log('Disconnected', connections.length);
  });

 
  socket.on('send chat', function(data){
    console.log(data);
    io.sockets.emit('new chat', {msg: data, user: socket.username});
  });

 
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit('get users', users);
  }
});
require('./routes/routes.js')(app);

server.listen(process.env.PORT || 3000, process.env.IP || 'localhost', function () {
  console.log('Server running');
});