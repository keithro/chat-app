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

// event listener
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// app.get('/', (req, res) => {
//   res.render('index.html');
// });

// Server
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});