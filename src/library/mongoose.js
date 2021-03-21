if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");

const startMongoServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("DATABASE is connected!!");
  } catch (error) {
    console.log(`Error in DB connection: ${error}`);
  }
};

module.exports = startMongoServer;
