// initiate request from the client to communicate with the server
var socket = io();

// connect event listener
socket.on('connect', function () {
  console.log('Connected to server');

  // // new message emitter client to server
  // socket.emit('createMessage', {
  //   from: 'Jen',
  //   text: 'Eww. Stop messaging me, creep.'
  // });

});

// disconnect event listener
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// incoming message listener server to client
socket.on('newMessage', function (message) {
  console.log('Got new message', message);
})