const routes = require('express').Router();
const contacts = require('./contacts');
const swagger = require('./swagger');

routes.use('/', swagger);
// #swagger.tags=['Contacts']
routes.use('/contacts', contacts);
routes.use('/', (req, res) => {
  const docData = {
    documentationURL: 'https://contacts-project-vezc.onrender.com/api-docs/',
  };
  res.send(docData);
});

module.exports = routes;
