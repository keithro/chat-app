const path = require ('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

// Express static middleware to serve 'public' folder
app.use(express.static(publicPath));

// app.get('/', (req, res) => {
//   res.render('index.html');
// });

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});