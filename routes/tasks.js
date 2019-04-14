const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Task, validateTask } = require("../models/task");

/*
 * aggregate based on the month and sum up the total duration
 */
router.get("/total-monthly-durations/:user_id", async (req, res) => {
  const tasks = await Task.aggregate([
    { $match: { user_id: ObjectId(req.params.user_id) } },
    { $unwind: "$days" },
    { $group: { _id: "$month" , total: {$sum: "$days.duration"} }}
  ]);
  res.send(tasks);
});

/*
 * aggregate based on the week and sum up the total duration
 */
router.get("/total-weekly-durations/:user_id", async (req, res) => {
  const tasks = await Task.aggregate([
    { $match: { user_id: ObjectId(req.params.user_id) } },
    { $unwind: "$days" },
    { $group: { _id: "$weekInYear" , total: {$sum: "$days.duration"} }}
  ]);
  res.send(tasks);
});

/*
 * post a new task for a user by its id
 */
router.post("/new/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const taskObj = _.pick(req.body, [
    "title",
    "year",
    "month",
    "weekInYear",
    "days"
  ]);
  const task = new Task({ ...taskObj, user_id });
  await task.save({ ...req.body, user_id: req.params.user_id });
  res.send(task);
});

/*
 * get tasks based on the user and the week
 */
router.get("/:user_id/:week_number", async (req, res) => {
    const tasks = await Task.find({
      user_id: req.params.user_id,
      weekInYear: req.params.week_number
    })
      // .populate("user_id")
      .select(["title", "days", "user_id"]);
    res.send(tasks);
});

/*
 * get tasks based on the user
 */
router.get("/:user_id", async (req, res) => {
    const tasks = await Task.find({
      user_id: req.params.user_id
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
