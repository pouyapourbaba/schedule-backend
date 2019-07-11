const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Task, validateTask } = require("../models/Task");
const auth = require("../middleware/auth");

/*
 * __TESTED__
 * @ TODO -> right now the userId is given via the route params
 *           however, we can get the userId via the auth middleware
 *                      req.user.id
 *           but for passing the test it was not possible to do that
 *           because a valid userId from a logged in user is not used
 */
router.get("/:userId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    if (tasks.length === 0) return res.status(404).send("no tasks found");
    res.json(tasks);
  } catch (error) {}
});

/*
 * post a new task for a user by its id
 */
router.post("/", auth, async (req, res) => {
  const userId = req.user.id;

  if (!req.body.title) return res.status(400).send("title is required");
  if (!req.body.year) return res.status(400).send("Year is required");
  if (!req.body.month) return res.status(400).send("Month is required");
  if (!req.body.week) return res.status(400).send("Week is required");

  const taskObj = _.pick(req.body, [
    "title",
    "year",
    "month",
    "week",
    "days"
  ]);

  let task = new Task({ ...taskObj, userId });
  task = await task.save();
  res.json(task);
});

/*
 * __TESTED__
 * aggregate based on the month and sum up the total duration
 * 
 * @ TODO -> right now the userId is given via the route params
 *           however, we can get the userId via the auth middleware
 *                      req.user.id
 *           but for passing the test it was not possible to do that
 *           because a valid userId from a logged in user is not used
 */
router.get("/total-monthly-durations/:user_id", async (req, res) => {
  const tasks = await Task.aggregate([
    { $match: { user_id: ObjectId(req.params.user_id) } },
    { $unwind: "$days" },
    { $group: { _id: "$month", total: { $sum: "$days.duration" } } }
  ]);
  res.send(tasks);
});

/*
 * aggregate based on the week and sum up the total duration
 */
router.get("/sum-weeks/:userId", auth, async (req, res) => {
  const tasks = await Task.aggregate([
    { $match: { userId: ObjectId(req.params.userId) } },
    { $unwind: "$days" },
    { $group: { _id: "$week", total: { $sum: "$days.duration" } } }
  ]);
  // if(tasks.length ==)
  res.json(tasks);
});

/*
 * get tasks based on the user and the week
 */
router.get("/:week_number", auth, async (req, res) => {
  const tasks = await Task.find({
    user_id: req.user.id,
    weekInYear: req.params.week_number
  })
    // .populate("user_id")
    .select(["title", "days", "user_id"]);
  res.send(tasks);
});

/*
 * get tasks based on the user
 */
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({
    user_id: req.user.id
  })
    // .populate("user_id")
    .select(["title", "days", "weekInYear", "month", "user_id"]);
  res.send(tasks);
});

/*
 * delete a task
 */
router.delete("/delete/:task_id", async (req, res) => {
  const result = await Task.findOneAndDelete({ _id: req.params.task_id });
  res.send(result);
});

/*
 * update a task
 */
router.put("/update/:task_id", async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.task_id },
    {
      $set: { title: req.body.title, days: req.body.days }
    },
    { new: true }
  );
  res.send(task);
});

module.exports = router;
