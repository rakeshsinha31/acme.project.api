const express = require("express");
const startMongoServer = require("./src/library/mongoose");

const app = express();
app.use(express.json());

app.use("/", (req, res, next) => {
  res.send("test connectivity to server");
});

const startServer = async (port) => {
  await startMongoServer();
  app.listen(port);
};

startServer(Number(3000));
