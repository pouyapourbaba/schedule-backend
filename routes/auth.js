const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, userAuthenticationValidator } = require("../models/user");
const { validationResult } = require("express-validator");
const auth = require("../middleware/auth");

// @route   GET api/auth
// @desc    Register user
// @access  Public
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post("/", userAuthenticationValidator, async (req, res) => {
  // validate the user by Joi and JOI
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // check to see if the user with the entered email already exists
  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({errors:[{ msg: "Invalid email or password" }]});

  // compare the hashed password with the entered password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({errors:[{ msg: "Invalid email or password" }]});

  // create a jwt when the user logs in and set it in the response header
  const token = user.generateAuthToken();
  // res.header("x-auth-token", token).send("Logged in successfully");
  res.json({ token });
});

/*
 * validation function
 */
function validate(req) {
  const schema = {
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
