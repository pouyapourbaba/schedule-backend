const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

/*
 * login a user
 */
router.post("/", async (req, res) => {
  // validate the user by Joi and JOI
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check to see if the user with the entered email already exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // compare the hashed password with the entered password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // create a jwt when the user logs in and set it in the response header
  const token = user.generateAuthToken();
  // res.header("x-auth-token", token).send("Logged in successfully");
  res.send(token);
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
