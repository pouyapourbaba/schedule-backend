const Joi = require("joi");
const mongoose = require("mongoose");

// Define the task schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 255 },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  year: {type: Number, required: true},
  month: {type: Number, required: true},
  weekInYear: {type: Number, required: true},
  days: [{
    day: {type: String, required: true},
    duration: {type: Number, required: true}
  }]
});

function validateTask(task) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(512)
      .required(),
    // user_id: Joi.required(),
    year: Joi.number().required(),
    month: Joi.number().required(),
    weekInYear: Joi.number().required()
  };

  return Joi.validate(task, schema);
}

const Task = mongoose.model("Task", taskSchema);

exports.Task = Task;
exports.validateTask = validateTask;
