const _ = require("lodash");
const { Todo, validateTodo } = require("../models/todo");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("This is the todos.");
});

router.post("/", async (req, res) => {
  // validate the todo by Joi
  const { error } = validateTodo(req.body);
  if (error) res.status(400).send("Invalid todo item.");

  const todo = new Todo(_.pick(req.body, ["title", "user_id"]));

  await todo.save();

  res.send(todo);
});

module.exports = router;
