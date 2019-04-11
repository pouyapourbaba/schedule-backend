const config = require("config");
const mongoose = require("mongoose");
const logger = require("./logging")

module.exports = function() {
  mongoose
    .connect(config.get("db"), {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => logger.infoLogger("Connected to MongoDB.."));
};
