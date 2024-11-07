const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongodb = require("./db/connection")

const baseRoute = require('./routes/index');
const contactRoute = require('./routes/contactsRoute');

dotenv.config();

const port = process.env.PORT || 3000;

/* Routes */

app.use('/', baseRoute);

app.use('/contacts', contactRoute);

/* Error Handler */

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

/* Database Connection an api initialization */

mongodb.initDb((err) => {
  if(err) {
    console.log(err)
  } else {
    app.listen(port, () => {
      console.log('Database is connected and Web Server is listening at port ' + port);
    });
  };
})