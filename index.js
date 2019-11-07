const express = require('express');
const app = express();
const config = require('./config');
console.log(config.jwtPrivateKey);

// set the route handlers
require('./startup/routes')(app);

// initialize the DB connection
require('./startup/db')();

// configuration logic
require('./startup/config')();

require('./startup/prod')(app);

const server = app.listen(config.PORT, () =>
  console.log(`Listening on port ${config.PORT}...`)
);

module.exports = server;
