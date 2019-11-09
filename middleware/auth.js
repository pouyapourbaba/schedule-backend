const jwt = require('jsonwebtoken');
const config = require('../config');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token)
    return res
      .status(401)
      .json({ msg: 'Access denied. No token was provided' });

  try {
    const decoded = jwt.verify(token, config.jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

module.exports = auth;
