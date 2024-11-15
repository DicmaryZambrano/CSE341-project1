const express = require('express');
const dotenv = require('dotenv');
const BodyParser = require('body-parser');
const mongodb = require('./db/connection');
const routes = require('./routes');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  next();
});

/* Routes */

app.use('/', routes);

/* Error Handler */

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

/* Database Connection an api initialization */

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(
        `Database is connected and Web Server is listening at port ${port}`,
      );
    });
  }
});
