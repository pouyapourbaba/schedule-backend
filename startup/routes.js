const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const error = require("../middleware/error");
const users = require("../routes/users");
const login = require("../routes/login");
const todos = require("../routes/todos");
const tasks = require("../routes/tasks");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan("dev"));

  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use("/api/todos", todos);
  app.use("/api/tasks", tasks);

  // error handler middleware
  app.use(error);
};
