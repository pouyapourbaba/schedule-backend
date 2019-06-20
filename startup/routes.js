const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const error = require("../middleware/error");
const users = require("../routes/users");
const auth = require("../routes/auth");
const todos = require("../routes/todos");
const tasks = require("../routes/tasks");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan("dev"));

  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/todos", todos);
  app.use("/api/tasks", tasks);

  // error handler middleware
  app.use(error);
};
