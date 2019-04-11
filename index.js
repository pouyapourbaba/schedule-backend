require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const error = require("./middleware/error");
const users = require("./routes/users");
const login = require("./routes/login");
const todos = require("./routes/todos");
const tasks = require("./routes/tasks");
const app = express();

// handle uncaught exceptions and exit the process
winston.exceptions.handle(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

// handle unhandled rejections and exit the process
process.on("unhandledRejection", ex => {
  throw ex;
});

// log the errors into a file and the db
winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/scheduler",
    level: "warn"
  })
);

// check the jwtPrivateKey in the environment variables
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/scheduler", {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to MongoDB.."))
  .catch(err => console.error("Could not connect to MongoDB..", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/users", users);
app.use("/api/login", login);
app.use("/api/todos", todos);
app.use("/api/tasks", tasks);

// error handler middleware
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
