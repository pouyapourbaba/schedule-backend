const config = require('../config');

module.exports = function() {
  // check the jwtPrivateKey in the environment variables
  if (!config.jwtPrivateKey) {
    console.log('TCL: jwtPrivateKey', jwtPrivateKey);
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
};
