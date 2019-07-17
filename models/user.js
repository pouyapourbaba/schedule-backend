const mongoose = require("mongoose");
const { check } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");

// Define the user Schema
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, minlength: 4, maxlength: 255 },
  last_name: { type: String, required: true, minlength: 4, maxlength: 255 },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
    unique: true
  },
  avatar: { type: String },
  date: { type: Date, default: Date.now }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this.id
    },
    config.get("jwtPrivateKey"),
    { expiresIn: 3600 * 12 }
  );
};

/*
 * user validator
 */
const validateUser = [
  check("first_name", "Firstname is required")
    .not()
    .isEmpty(),
  check(
    "first_name",
    "Firstname must be between 4 and 255 characters"
  ).isLength({ min: 4, max: 255 }),
  check("last_name", "Lasttname is required")
    .not()
    .isEmpty(),
  check("last_name", "Lastname must be between 4 and 255 characters").isLength({
    min: 4,
    max: 255
  }),
  check("email", "Please include a valide email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more character"
  ).isLength({ min: 6 })
];

const userAuthenticationValidator = [
  check("email", "Please include a valide email").isEmail(),
  check("password", "Password is required").exists()
];

// User model
const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateUser = validateUser;
exports.userAuthenticationValidator = userAuthenticationValidator;
