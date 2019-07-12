const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Task, validateTask } = require("../models/Task");
const auth = require("../middleware/auth");

/*
 * __TESTED
 * __GET    :     /api/tasks
 * __DESC   :     get the tasks for a user
 * __AUTH   :     required
 */
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: ObjectId(req.user.id) });
    if (tasks.length === 0) return res.status(404).send("no tasks found");
    res.json(tasks);
  } catch (error) {}
});

/*
 * __TESTED
 * __POST   :     /api/tasks
 * __DESC   :     post a new task for a user
 * __AUTH   :     required
 */
router.post("/", auth, async (req, res) => {
  const userId = req.user.id;

  if (!req.body.title) return res.status(400).send("title is required");
  if (!req.body.year) return res.status(400).send("Year is required");
  if (!req.body.month) return res.status(400).send("Month is required");
  if (!req.body.week) return res.status(400).send("Week is required");

  const taskObj = _.pick(req.body, ["title", "year", "month", "week", "days"]);

  let task = new Task({ ...taskObj, userId });
  task = await task.save();
  res.json(task);
});

/*
 * __TESTED
 * __GET    :     /api/tasks/sum-weeks
 * __DESC   :     aggregate based on the week and sum up the total duration
 * __AUTH   :     required
 */
router.get("/sum-weeks", auth, async (req, res) => {
  const tasks = await Task.aggregate([
    { $match: { userId: ObjectId(req.user.id) } },
    { $unwind: "$days" },
    { $group: { _id: "$week", total: { $sum: "$days.duration" } } }
  ]);
  if (tasks.length === 0) return res.status(404).send("no tasks were found");
  res.json(tasks);
});

/*
 * __TESTED
 * __GET    :     /api/tasks/sum-weeks
 * __DESC   :     aggregate based on the month and sum up the total duration
 * __AUTH   :     required
 */
router.get("/sum-months", auth, async (req, res) => {
  const tasks = await Task.aggregate([
    { $match: { userId: ObjectId(req.user.id) } },
    { $unwind: "$days" },
    { $group: { _id: "$month", total: { $sum: "$days.duration" } } }
  ]);
  if (tasks.length === 0) res.status(404).send("no tasks were found");
  res.send(tasks);
});

/*
 * __TESTED
 * __GET    :     /api/tasks/week/:number
 * __DESC   :     get tasks based on the user and the week
 * __AUTH   :     required
 */
router.get("/week/:number", auth, async (req, res) => {
  const tasks = await Task.find({
    userId: ObjectId(req.user.id),
    week: req.params.number
  })
    // .populate("userId")
    .select(["title", "days", "userId"]);

  if (tasks.length === 0) return res.status(404).send("no tasks found");
  res.json(tasks);
});

/*
 * __TESTED
 * __GET    :     /api/tasks/month/:number
 * __DESC   :     get tasks based on the user and the month
 * __AUTH   :     required
 */
router.get("/month/:number", auth, async (req, res) => {
  const tasks = await Task.find({
    userId: ObjectId(req.user.id),
    month: req.params.number
  })
    // .populate("userId")
    .select(["title", "days", "userId"]);

  if (tasks.length === 0) return res.status(404).send("no tasks found");
  res.json(tasks);
});

/*
 * __TESTED
 * __DELETE :     /api/tasks/:taskId
 * __DESC   :     delete a task
 * __AUTH   :     required
 */
router.delete("/:taskId", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.taskId))
    return res.status(404).send("task not found");

  const result = await Task.findOneAndDelete({
    _id: ObjectId(req.params.taskId),
    userId: ObjectId(req.user.id)
  });

  if (!result || result.length === 0)
    return res.status(404).send("task not found");

  res.status(204).send(result);
});

/*
 * update a task
 */
router.put("/:taskId", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.taskId))
    return res.status(404).send("task not found");

  const task = await Task.findOneAndUpdate(
    { _id: req.params.taskId },
    {
      $set: { title: req.body.title, days: req.body.days }
    },
    { new: true }
  );

  if (!task || task.length === 0) return req.send(404).send("task not found");

  res.status(201).json(task);
});

/*
 * get tasks based on the user
 */
// router.get("/", auth, async (req, res) => {
//   const tasks = await Task.find({
//     user_id: req.user.id
//   })
//     // .populate("user_id")
//     .select(["title", "days", "weekInYear", "month", "user_id"]);
//   res.send(tasks);
// });

module.exports = router;
