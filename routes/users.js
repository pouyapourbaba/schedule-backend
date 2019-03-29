const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  User,
  validateUser,
  validatePasswordComplexity
} = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // validate the user by Joi
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check the passwrod complexity
  const pass = validatePasswordComplexity(req.body.password);
  if (pass.length) {
    return res.status(400).send("The password must have or contain:  " + pass);
  }

  // check to see if the user with the entered email already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // if the user is new, create the user object
  user = new User(
    _.pick(req.body, ["first_name", "last_name", "email", "password"])
  );
  // has the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // save the user in DB
  await user.save();

  // email verification? no direct login after registration
  // ... Code

  // create a jwt when the user registers and log them in immediately
  const token = user.generateAuthToken();

  // return the following object to the client after registration and set
  // the jwt in the header of the response
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "first_name", "last_name", "email"]));
});

module.exports = router;
