const cors = require('cors');
const express = require('express');
var path = require('path');
require('dotenv').config();

const app = express();
const indexRoutes = require('./src/routes/index.routes');
const whitelist = ['http://localhost', 'https://tp-web2-one.vercel.app/'];

//Settings
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
  })
);

//Routes
app.use('/api', indexRoutes);

// Static content
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Server
app.listen(port, () => {
  console.clear();
  console.log(`Server live on port: ${port}`);
});
