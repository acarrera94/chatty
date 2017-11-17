var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongo = require('mongodb').MongoClient;

mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }

	console.log('MongoDB connected...');
});

app.use(express.static('lib'));

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
    
