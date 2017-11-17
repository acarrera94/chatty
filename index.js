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

// app.get('/', function(req, res){
// res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
    var chat = db.collection('chats');

    sendStatus = (s) => {
      socket.emit('status', s);
    }

    chat.find().limit(15).sort({_id:1}).toArray(function(err, res) {
      if(err) throw err;

      socket.emit('output', res);
    });

    socket.on('input', function(data){
      var name = data.name;
      var message = data.message;

      if(name == '' || message == '')
        sendStatus('You must enter a name and message');
      else {
        chat.insert({name: name, message: message}, function(){
          io.emit('output', [data]);

          sendStatus({
            message: "Message sent",
            clear: true
          });
        });
      }
    });

    socket.on('clear', function(data){
      chat.remove({}, function(){
        socket.emit('cleared');
      })
    })

    // io.emit('chat message', msg);
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
