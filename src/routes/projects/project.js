const express = require("express");
const router = express.Router();
const ProjectController = require("../../controllers/projects/project");

router.post("/", ProjectController.createProject);

module.exports = router;
