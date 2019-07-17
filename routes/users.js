const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser } = require("../models/User");
const { validationResult } = require("express-validator");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post("/", validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, email, password } = req.body;

  // check to see if the user with the entered email already exists
  let user = await User.findOne({ email });
  if (user)
    return res.status(400).json({ errors: [{ msg: "User already exists" }] });

  // Get users gravatar
  const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

  // if the user is new, create the user object
  user = new User({
    first_name,
    last_name,
    email,
    avatar,
    password
  });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // save the user in DB
  await user.save();

  // email verification? no direct login after registration
  // ... Code

  // create a jwt when the user registers and log them in immediately
  const token = user.generateAuthToken();

  // return the token in the response
  res.send({ token });
});

/*
 * update the properties of a user except its password
 */
router.put("/update/:id", async (req, res) => {
  // validate the user property by Joi
  // const property = Object.keys(req.body)[0];
  // const schema = { [property]: joiSchema[property] };
  // const { error } = validateUser(req.body, schema);
  // if (error) return res.status(400).send(error.details[0].message);

  if (_.isEmpty(req.body)) return;

  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body
    },
    { new: true }
  );
  res.send(
    _.pick(user, ["_id", "first_name", "last_name", "email", "added_date"])
  );
});

module.exports = router;
