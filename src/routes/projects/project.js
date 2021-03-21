const express = require("express");
const router = express.Router();
const ProjectController = require("../../controllers/projects/project");

router.get("/", ProjectController.getAllProjects);
router.post("/", ProjectController.createProject);
router.put("/:projectId", ProjectController.updateProject);
router.patch("/assign/:projectId", ProjectController.assignParticipant);

module.exports = router;
