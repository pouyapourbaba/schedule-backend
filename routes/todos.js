const auth = require("../middleware/auth");
const _ = require("lodash");
const { Todo, validateTodo } = require("../models/todo");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.send(todos)
});

router.post("/", auth, async (req, res) => {
  // validate the todo by Joi
  const { error } = validateTodo(req.body);
  if (error) res.status(400).send("Invalid todo item.");

  // get the user_id from the jwt that is added to the req in the auth module
  const user_id = req.user._id;

  const todo = new Todo({title: req.body.title, user_id: user_id});

  await todo.save();

  res.send(todo);
});

module.exports = router;
