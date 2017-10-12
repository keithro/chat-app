const path = require ('path');
const http = require ('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
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

  // New user greeting
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  // New user joined notification
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  // listener for newly created messages from client to broadcast
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');

    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
  })

  // disconnect listener
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Server
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});