const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "error",
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: [
    // new transports.Console({ level: "info" }),
    new transports.File({ filename: "info.log", level: "info" }),
  ],
});

module.exports = logger;
