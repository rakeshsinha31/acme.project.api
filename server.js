const express = require("express");
const startMongoServer = require("./src/library/mongoose");
const ProjectRouter = require("./src/routes/projects/project");
const apiErrorHandler = require("./src/errors/api-error-handler");
const ApiError = require("./src/errors/ApiError");

const app = express();
app.use(express.json());

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
