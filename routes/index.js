const routes = require('express').Router();
const contacts = require('./contacts');
const swagger = require('./swagger');

routes.use('/', swagger);
// #swagger.tags=['Contacts']
routes.use('/contacts', contacts);
routes.use('/', (req, res) => {
  const docData = {
    documentationURL: 'https://nathanbirch.github.io/nathan-byui-api-docs',
  };
  res.send(docData);
});

module.exports = routes;
