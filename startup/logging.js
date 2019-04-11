const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports.mainLogger = function() {
  // handle uncaught exceptions and exit the process
  winston.exceptions.handle(
    new winston.transports.Console(),
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
};

// custome logger for logging infos on the console
module.exports.infoLogger = message =>
  winston
    .createLogger({
      transports: [new winston.transports.Console()],
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.simple()
      )
    })
    .info(message);
