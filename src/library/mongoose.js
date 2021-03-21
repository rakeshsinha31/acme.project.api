if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const logger = require("../library/logger");

const startMongoServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    logger.log({ message: "DATABASE is connected!!", level: "info" });
  } catch (error) {
    logger.log({ message: error, level: "error" });
  }
};

module.exports = startMongoServer;
