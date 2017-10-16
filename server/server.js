const path = require ('path');
const http = require ('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// Express static middleware to serve 'public' folder
app.use(express.static(publicPath));

// event listeners
io.on('connection', (socket) => {
  console.log('New user connected');

  // New user in room listener
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    // join room
    socket.join(params.room);
    // remove user from any other rooms
    users.removeUser(socket.id);
    // add user to room list
    users.addUser(socket.id, params.name, params.room);

    // emit new user list to everyone in room
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // New user greeting
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // New user joined notification
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });

  // Create message - listener for newly created messages from client to broadcast
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  // emit location
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  // disconnect listener
  socket.on('disconnect', () => {
    // store any removed users
    var user = users.removeUser(socket.id);

    // if a user was removed
    if (user) {
      // update user list
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      // emit message from admin to all remaining users
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

// Server
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});