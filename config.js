process.env.NODE_EVN = process.env.NODE_EVN || 'development';

const config = {
  env: process.env.NODE_EVN,
  PORT: process.env.SCHEDU_API_PORT || 3001,
  jwtPrivateKey: process.env.SCHEDU_JWT_KEY || 'secret',
  mongo: {
    uri: process.env.SCHEDU_MONGO_URI || 'mongodb://mongo:27017/schedu'
  }
};

module.exports = config;
