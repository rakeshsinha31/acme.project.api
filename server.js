const express = require("express");

const app = express();
app.use(express.json());

app.use("/", (req, res, next) => {
  res.send("test connectivity to server");
});

const startServer = (port) => {
  app.listen(port);
};

startServer(Number(3000));
