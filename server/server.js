const path = require ('path');
const http = require ('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// Express static middleware to serve 'public' folder
app.use(express.static(publicPath));

// event listeners
io.on('connection', (socket) => {
  console.log('New user connected');


  // // server to client
  // socket.emit('newMessage', {
  //   from: 'Jesse',
  //   text: 'Hey you up?',
  //   craetedAt: '112233'
  // });

  // client to server
  // listener for newly created messages from client to broadcast
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  })


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Server
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});