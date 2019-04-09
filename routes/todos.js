const auth = require("../middleware/auth");
const _ = require("lodash");
const { Todo, validateTodo } = require("../models/todo");
const express = require("express");
const router = express.Router();

/* *****************
// get all the todos
***************** */
router.get("/:id", async (req, res) => {
  try {
    const todos = await Todo.find({ user_id: req.params.id })
      .populate("user_id")
      .select("title");
    res.send(todos);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

/* ****************************************
// get todos based on the user and the week
**************************************** */
router.get("/:user_id/:week", async (req, res) => {
  try {
    const todos = await Todo.find({ user_id: req.params.user_id, weekInYear: req.params.week })
      .populate("user_id")
      .select(["title", "isDone"]);
    res.send(todos);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

/* ***************
// post a new todo
*************** */
router.post("/:user_id", async (req, res) => {
  // validate the todo by Joi
  const { error } = validateTodo(req.body);
  if (error) return res.status(400).send("Invalid todo item.");

  const user_id = req.params.user_id;
  const todoObj = _.pick(req.body, ["title", "year", "month", "weekInYear", "isDone"]);
  const todo = new Todo({ ...todoObj, user_id });
  console.log("{...todoObj, user_id} ", { ...todoObj, user_id });

  await todo.save();

  res.send(todo);
});

/* *************
// delete a todo
************* */
router.delete("/:id", async (req, res) => {
  const result = await Todo.findOneAndDelete({ _id: req.params.id });
  res.send(result);
});

/* *************
// update a todo
************* */
router.put("/:id", async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: { title: req.body.title }
    },
    { new: true }
  );
  res.send(todo);
});

/* ***************************
// update the status of a todo 
*************************** */
router.put("/status/:id", async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: { isDone: !req.body.isDone }
    },
    { new: true }
  );
  res.send(todo);
});

module.exports = router;
