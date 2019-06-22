const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Profile, profileValidator } = require("../models/Profile");
const { User } = require("../models/User");
const { validationResult } = require("express-validator");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    "user",
    ["first_name", "last_name", "avatar"]
  );

  if (!profile) {
    return res
      .status(400)
      .json({ errors: { msg: "There is no profile for this user" } });
  }

  res.json(profile);
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post("/", [auth, profileValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // pull the information out of the body of the request
  const {
    phone,
    address,
    birthday,
    country,
    city,
    postal_code,
    nationality,
    occupation,
    about,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
    github
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (phone) profileFields.phone = phone;
  if (address) profileFields.address = address;
  if (birthday) profileFields.birthday = birthday;
  if (country) profileFields.country = country;
  if (city) profileFields.city = city;
  if (postal_code) profileFields.postal_code = postal_code;
  if (nationality) profileFields.nationality = nationality;
  if (occupation) profileFields.occupation = occupation;
  if (about) profileFields.about = about;

  // Build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;
  if (github) profileFields.social.github = github;

  let profile = await Profile.findOne({ user: req.user.id });
  if (profile) {
    // Update
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );
    return res.send(profile);
  }

  // Create
  profile = new Profile(profileFields);
  await profile.save();
  res.json(profile);
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  const profiles = await Profile.find().populate("user", [
    "first_name",
    "last_name",
    "avatar"
  ]);

  res.json(profiles);
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.user_id }).populate(
    "user",
    ["first_name", "last_name", "avatar"]
  );

  if (!profile)
    return res
      .status(400)
      .json({ errors: { msg: "Profile not found" } });

  res.json(profile);
});

// @route   DELETE api/profile
// @desc    Delete profile, user, todos, and everything related to that user
// @access  Private
router.delete("/", auth, async (req, res) => {
  // @todo - romove users tasks
  // @todo - romove users todos
  // remove profile
  await Profile.findOneAndRemove({user: req.user.id});
  // remove user
  await User.findOneAndRemove({_id: req.user.id});

  res.json({msg: "User Removed"});
});


module.exports = router;
