const Joi = require("joi");
const mongoose = require("mongoose");

// Define the todo schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 255 },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
});

function validateTodo(todo) {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(255)
      .required(),
    user_id: Joi.required()
  };

  return Joi.validate(todo, schema);
}

const Todo = mongoose.model("Todo", todoSchema);

exports.Todo = Todo;
exports.validateTodo = validateTodo;
