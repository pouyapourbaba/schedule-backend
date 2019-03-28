var cors = require("cors");
const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const login = require("./routes/login");
const todos = require("./routes/todos");
const app = express();

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

app.use(cors());
app.use(express.json());
app.use("/api/users", users);
app.use("/api/login", login);
app.use("/api/todos", todos);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
