const mongoose = require("mongoose");
const { check } = require("express-validator");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  phone: { type: String, maxlength: 255 },
  address: {
    type: String,
    maxlength: 255
  },
  birthday: { type: String, maxlength: 255 },
  gender: { type: String, maxlength: 32 },
  country: { type: String, maxlength: 32 },
  postal_code: { type: String, maxlength: 32 },
  city: { type: String, maxlength: 32 },
  nationality: { type: String, maxlength: 32 },
  occupation: { type: String, maxlength: 64 },
  about: { type: String, maxlength: 1024 },
  social: {
    youtube: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    github: { type: String }
  },
  date: { type: Date, default: Date.now }
});

/*
 * Profile validator
 */
const profileValidator = [
  check(
    "phone",
    "Phone number must contain less than 255 characters"
  ).isLength({ max: 255 }),
  check(
    "address",
    "Postal address must contain less than 255 characters"
  ).isLength({ max: 255 }),
  check("birthday", "Birthday must contain less than 255 characters").isLength({
    max: 255
  }),
  check("gender", "Gender must contain less than 32 characters").isLength({
    max: 32
  }),
  check("country", "Country must contain less than 32 characters").isLength({
    max: 32
  }),
  check("city", "City must contain less than 32 characters").isLength({
    max: 32
  }),
  check("postal_code", "Post code must contain less than 32 characters").isLength({
    max: 32
  }),
  check(
    "nationality",
    "Nationality must contain less than 32 characters"
  ).isLength({ max: 32 }),
  check(
    "occupation",
    "Occupation must contain less than 64 characters"
  ).isLength({ max: 64 }),
  check("about", "About must contain less than 1024 characters").isLength({
    max: 1024
  })
];

const Profile = mongoose.model("Profile", ProfileSchema);

exports.Profile = Profile;
exports.profileValidator = profileValidator;
