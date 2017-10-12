// initiate request from the client to communicate with the server
var socket = io();

// connect event listener
socket.on('connect', function () {
  console.log('Connected to server');
});

// disconnect event listener
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// incoming message listener server to client
socket.on('newMessage', function (message) {
  console.log('Got new message', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});