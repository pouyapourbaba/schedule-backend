const config = require("config");
const mongoose = require("mongoose");
const logger = require("./logging")

module.exports = function() {
  logger.infoLogger(config("db"))
  mongoose
    .connect(config("db"), {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => logger.infoLogger("Connected to MongoDB.."));
};
