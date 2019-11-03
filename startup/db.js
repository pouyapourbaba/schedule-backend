const config = require('../config');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose
    .connect(config.mongo.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => console.log(`Connected to ${config.mongo.uri}..`));
};
