// eslint-disable-next-line node/no-unpublished-require
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Cse341 Contacts API',
    description: 'An API to manage and retrieve information about contacts.',
  },
  host: 'contacts-project-vezc.onrender.com',
  basePath: '/',
  schemes: ['https'],
  definitions: {
    Contact: {
      _id: '6732fa9fbdeec34a5760cd49',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      favoriteColor: 'Blue',
      birthday: '1990-01-01',
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./app.js'];

swaggerAutogen(outputFile, routes, doc);
