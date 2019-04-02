const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const passwordValidator = require("password-validator");

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
  added_date: { type: Date, default: Date.now }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id, first_name: this.first_name, last_name: this.last_name, added_date: this.added_date, email: this.email }, config.get("jwtPrivateKey"));
}
/* ************** 
// schema for Joi
************** */
const schema = {
  first_name: Joi.string()
    .min(4)
    .max(255)
    .required(),
  last_name: Joi.string()
    .min(4)
    .max(255)
    .required(),
  email: Joi.string()
    .min(6)
    .max(255)
    .required()
    .email(),
  password: Joi.string()
    .min(6)
    .max(255)
    .required(),
  added_date: Joi.date(),
};

/* ************** ******
// user validator by Joi
* *********************/
function validateUser(user, schema) {
  return Joi.validate(user, schema);
}

// // validate only one property
// function validateOneProperty(user) {

// }

// Password complexity
function validatePasswordComplexity(pass) {
  var passwordSchema = new passwordValidator();
  passwordSchema
    .is()
    .min(6) // Minimum length 8
    .is()
    .max(255) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .symbols() // Must have symbols
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values
  return passwordSchema.validate(pass, { list: true });
}

// User model
const User = mongoose.model("User", userSchema);

exports.User = User;
exports.joiSchema = schema;
exports.validateUser = validateUser;
exports.validatePasswordComplexity = validatePasswordComplexity;
