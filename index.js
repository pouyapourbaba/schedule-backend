const winston = require("winston")
const express = require("express");
const app = express();

// set up the logging functionalities
const logger = require("./startup/logging")
logger.mainLogger()

// set the route handlers
require("./startup/routes")(app);

// initialize the DB connection
require("./startup/db")();

// configuration logic
require("./startup/config")()

require("./startup/prod")(app)

const port = process.env.PORT || 3000;
app.listen(port, () => logger.infoLogger(`Listening on port ${port}...`));
