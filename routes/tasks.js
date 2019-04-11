const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Task, validateTask } = require("../models/task");

router.post("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const taskObj = _.pick(req.body, [
    "title",
    "year",
    "month",
    "weekInYear",
    "days"
  ]);
  const task = new Task({ ...taskObj, user_id });
  console.log("task ", task);
  const result = await task.save({ ...req.body, user_id: req.params.user_id });
  res.send(task);
});

/* ****************************************
// get tasks based on the user and the week
**************************************** */
router.get("/:user_id/:week", async (req, res) => {
  try {
    const tasks = await Task.find({
      user_id: req.params.user_id,
      weekInYear: req.params.week
    })
      .populate("user_id")
      .select(["title", "days"]);
    res.send(tasks);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});
/* ****************************************
// get tasks based on the user
**************************************** */
router.get("/:user_id/", async (req, res) => {
  try {
    const tasks = await Task.find({
      user_id: req.params.user_id
    })
      .populate("user_id")
      .select(["title", "days", "weekInYear", "month"]);
    res.send(tasks);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

/* *************
// delete a task
************* */
router.delete("/:id", async (req, res) => {
  const result = await Task.findOneAndDelete({ _id: req.params.id });
  res.send(result);
});

/* *************
// update a task
************* */
router.put("/:id", async (req, res) => {
  const taskb = req.body;
  console.log("task body", taskb);
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: { title: req.body.title, days: req.body.days }
    },
    { new: true }
  );
  console.log("task result", task);
  res.send(task);
});

module.exports = router;
