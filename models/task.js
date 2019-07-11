const Joi = require("joi");
const mongoose = require("mongoose");

// Define the subSchema for days

// @TODO ----- Choose the one of the versions based on the frontend

// V2 -> implemented as array
const daySchema = new mongoose.Schema({
  day: String,
  duration: { type: Number, default: 0 }
});

// V1 -> implemented as object
// const daySchema = new mongoose.Schema({
//   mon: { type: Number, default: 0 },
//   tue: { type: Number, default: 0 },
//   wed: { type: Number, default: 0 },
//   thu: { type: Number, default: 0 },
//   fri: { type: Number, default: 0 },
//   sat: { type: Number, default: 0 },
//   sun: { type: Number, default: 0 }
// });

const Days = mongoose.model("Day", daySchema);
// Define the task schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 255 },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  week: { type: Number, required: true },
  days: [daySchema]
});

function validateTask(task) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(512)
      .required(),
    // userId: Joi.required(),
    year: Joi.number().required(),
    month: Joi.number().required(),
    week: Joi.number().required()
  };

  return Joi.validate(task, schema);
}

const Task = mongoose.model("Task", taskSchema);

exports.Task = Task;
exports.validateTask = validateTask;
