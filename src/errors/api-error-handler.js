const ApiError = require("./ApiError");
const logger = require("../library/logger");

const apiErrorHandler = (err, req, res, next) => {
  logger.log({ message: err, level: "error" });

  if (err instanceof ApiError) {
    res.status(err.code).json({ error: err.message });
    return;
  }
  return res.status(500).json({ error: "something went wrong" });
};

module.exports = apiErrorHandler;
