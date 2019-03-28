const auth = require("../middleware/auth");
const _ = require("lodash");
const { Todo, validateTodo } = require("../models/todo");
const express = require("express");
const router = express.Router();

/* *****************
// get all the todos
***************** */
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.send(todos);
});

/* ***************
// post a new todo
*************** */
router.post("/", auth, async (req, res) => {
  // validate the todo by Joi
  const { error } = validateTodo(req.body);
  if (error) res.status(400).send("Invalid todo item.");

  // get the user_id from the jwt that is added to the req in the auth module
  const user_id = req.user._id;

  const todo = new Todo({ title: req.body.title, user_id: user_id });

  await todo.save();

  res.send(todo);
});

/* *************
// delete a todo
************* */
router.delete("/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.send(result);
});

/* *************
// update a todo
************* */
router.put("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    {
      $set: { title: req.body.title }
    },
    { new: true }
  );
  res.send(todo);
});

module.exports = router;
