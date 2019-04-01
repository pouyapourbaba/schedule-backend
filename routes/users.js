const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  User,
  joiSchema,
  validateUser,
  validatePasswordComplexity
} = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

/* ************************
// GET THE USER INFORMATION
** ***********************/
router.get("/:id", async (req,res) => {
  const user = await User.findOne({_id: req.params.id});
  res.send(user);
})

/* ***************
// post a new user
** **************/
router.post("/", async (req, res) => {
  // validate the user by Joi
  const { error } = validateUser(req.body, joiSchema);
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
  user = await user.save();

  // email verification? no direct login after registration
  // ... Code

  // create a jwt when the user registers and log them in immediately
  const token = user.generateAuthToken();

  // return the following object to the client after registration and set
  // the jwt in the header of the response
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(
      _.pick(user, ["_id", "first_name", "last_name", "email", "added_date"])
    );
});
/* ***************************************************
// update the properties of a user except the password
** **************************************************/
router.put("/:id", async (req, res) => {
  // validate the user property by Joi
  console.log(req.body)
  const property = Object.keys(req.body)[0];
 console.log("property ", property);
  const schema = { [property]: joiSchema[property] };
  const { error } = validateUser(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: { [property]: req.body[property] }
    },
    { new: true }
  );
  res.send(user);
});

module.exports = router;
