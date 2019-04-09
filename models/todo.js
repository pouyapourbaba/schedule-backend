const Joi = require("joi");
const mongoose = require("mongoose");

// Define the todo schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 255 },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  year: {type: Number, required: true},
  month: {type: Number, required: true},
  weekInYear: {type: Number, required: true},
  isDone: Boolean
});

function validateTodo(todo) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(512)
      .required(),
    // user_id: Joi.required(),
    year: Joi.number().required(),
    month: Joi.number().required(),
    weekInYear: Joi.number().required(),
    isDone: Joi.boolean(),
  };

  return Joi.validate(todo, schema);
}

const Todo = mongoose.model("Todo", todoSchema);

exports.Todo = Todo;
exports.validateTodo = validateTodo;
