const express = require("express");
const startMongoServer = require("./src/library/mongoose");
const ProjectRouter = require("./src/routes/projects/project");
const apiErrorHandler = require("./src/errors/api-error-handler");
const ApiError = require("./src/errors/ApiError");

const app = express();
app.use(express.json());

// handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    req.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(`/api/${process.env.API_VERSION}/projects/`, ProjectRouter);

app.use((req, res, next) => {
  next(ApiError.notFound());
  return;
});

app.use(apiErrorHandler);

const startServer = async (port) => {
  await startMongoServer();
  app.listen(port);
};

startServer(Number(3000));
