const config = require("config");

module.exports = function() {
  // check the jwtPrivateKey in the environment variables
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
