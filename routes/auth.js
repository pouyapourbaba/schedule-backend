const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, userAuthenticationValidator } = require('../models/user');
const { validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// @route   GET api/auth
// @desc    Test user
// @access  Private
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.send(user);
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', userAuthenticationValidator, async (req, res) => {
  // validate the user by Joi and JOI
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { email, password } = req.body;
  email = email.toLowerCase();
  
  // check to see if the user with the entered email already exists
  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    return res
      .status(400)
      .json({ errors: [{ msg: 'Invalid email or password' }] });

  // compare the hashed password with the entered password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ errors: [{ msg: 'Invalid email or password' }] });

  // create a jwt when the user logs in and set it in the response header
  const token = user.generateAuthToken();

  // res.header("x-auth-token", token).send("Logged in successfully");
  res.json({ token });
});

module.exports = router;
