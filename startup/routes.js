const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const error = require("../middleware/error");
const users = require("../routes/Users");
const auth = require("../routes/auth");
const profile = require("../routes/profile")
const todos = require("../routes/todos");
const tasks = require("../routes/tasks");

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  if(process.env.NODE_ENV !== "test")
    app.use(morgan("dev"));

  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/profile", profile);
  app.use("/api/todos", todos);
  app.use("/api/tasks", tasks);

  // error handler middleware
  app.use(error);
};
