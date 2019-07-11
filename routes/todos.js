const auth = require("../middleware/auth");
const _ = require("lodash");
const { Todo, validateTodo } = require("../models/Todo");
const express = require("express");
const router = express.Router();

/*
 * get the list of all todos for a user by the user_id
 */
router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ user_id: req.user.id });
  res.send(todos);
});

/*
 * get todos based on the user and the week
 */
router.get("/:week_number", auth, async (req, res) => {
  const todos = await Todo.find({
    user_id: req.user.id,
    weekInYear: req.params.week_number
  })
    // .populate("user_id")
    .select(["title", "isDone"]);
  res.send(todos);
});

/*
 * post a new todo
 */
router.post("/", auth, async (req, res) => {
  console.log(req.body);
  // validate the todo by Joi
  const { error } = validateTodo(req.body);
  if (error) return res.status(400).send("Invalid todo item.");

  const user_id = req.user.id;
  const todoObj = _.pick(req.body, [
    "title",
    "year",
    "month",
    "weekInYear",
    "isDone"
  ]);
  const todo = new Todo({ ...todoObj, user_id });

  await todo.save();

  res.send(todo);
});

/*
 * delete a todo
 */
router.delete("/:todo_id", auth, async (req, res) => {
  console.log(req.params.todo_id);
  const result = await Todo.findOneAndDelete({
    _id: req.params.todo_id
  });
  res.send(result);
});

/*
 * update a todo
 */
router.put("/update-title/:todo_id", async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.todo_id },
    {
      $set: { title: req.body.title }
    },
    { new: true }
  );
  res.send(todo);
});

/*
 * update the status of a todo
 */
router.put("/update-status/:todo_id", async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.todo_id },
    {
      $set: { isDone: req.body.isDone }
    },
    { new: true }
  );
  res.send(todo);
});

module.exports = router;
