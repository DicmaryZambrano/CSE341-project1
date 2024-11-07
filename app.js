const express = require('express');
const app = express();
const dotenv = require('dotenv');

const baseRoute = require('./routes/index');

dotenv.config();

const port = process.env.PORT || 3000;

/* Routes */

app.use('/', baseRoute);

/* Error Handler */

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port, () => {
  console.log('Web Server is listening at port ' + port);
});
