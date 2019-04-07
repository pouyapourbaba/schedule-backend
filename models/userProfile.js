const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  first_name: { type: String, required: true, minlength: 6, maxlength: 255 },
  last_name: { type: String, required: true, minlength: 6, maxlength: 255 },
  phone_number: { type: String, required: true, minlength: 6, maxlength: 255 },
  postal_address: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  birth_date: { type: String, required: true, minlength: 6, maxlength: 255 },
  gender: { type: String, required: true, minlength: 2, maxlength: 32 },
  country: { type: String, required: true, minlength: 2, maxlength: 32 },
  nationality: { type: String, required: true, minlength: 2, maxlength: 32 }
});

function validateUserProfile(userProfile) {
  const schema = {
    user_id: Joi.objectId(),
    first_name: Joi.string()
      .min(6)
      .max(255)
      .required(),
    last_name: Joi.string()
      .min(6)
      .max(255)
      .required(),
    phone_number: Joi.string()
      .min(6)
      .max(255)
      .required(),
    postal_address: Joi.string()
      .min(6)
      .max(255)
      .required(),
    birth_date: Joi.string()
      .min(6)
      .max(255)
      .required(),
    gender: Joi.string()
      .min(2)
      .max(32)
      .required(),
    country: Joi.string()
      .min(2)
      .max(32)
      .required(),
    nationality: Joi.string()
      .min(2)
      .max(32)
      .required()
  };

  return Joi.validate(userProfile, schema);
}

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

exports.UserProfile = UserProfile;
exports.validateUserProfile = validateUserProfile;
