// initiate request from the client to communicate with the server
var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages')
  var newMessage = messages.children('li:last-child')

  // Heights - (using prop not jQuery to ensure cross-browser compatability)
    // height of viewport
  var clientHeight = messages.prop('clientHeight');
    // number of pixels we've scrolled down
  var scrollTop = messages.prop('scrollTop');
    // entire height of messages container
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    // set scroll amount to hight of container
    messages.scrollTop(scrollHeight);
  }
}

// connect event listener
socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      // SWAP OUT FOR MODAL WHEN RESTYLING
      alert(err);
      window.location.href = '/'
    } else {
      console.log('No error');
    }
  });
});

// disconnect event listener
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// new chat room user event
socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  // add each user to ol list
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  // use "html" to replace list rather than append
  jQuery('#users').html(ol);
});

// incoming message listener server to client
socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

// new location event listener
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

// Send location
var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    // use modal if you decide to restyle this
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});