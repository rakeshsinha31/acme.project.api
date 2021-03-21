const employee = require("../../library/employee-info");
const ProjectModel = require("../../models/project");
const ApiError = require("../../errors/ApiError");

module.exports = {
  createProject: async (req, res, next) => {
    const { name, owner } = req.body;
    if (!name || !owner) {
      next(ApiError.badRequest("name and owner fields are required"));
      return;
    }
    const creator = await employee(owner);
    if ("InternalError" in creator) {
      next(ApiError.internalError("error message"));
      return;
    }
    if ("IdError" in creator) {
      next(ApiError.badRequest(creator.IdError));
      return;
    }
    if (creator.role !== "manager") {
      next(
        ApiError.authorizationError(
          "Owner is not authorised to create a project"
        )
      );
      return;
    }
    if (await ProjectModel.findOne({ name })) {
      next(ApiError.badRequest("A Project with same name exists"));
      return;
    }
    try {
      const project = await ProjectModel.create({
        ...req.body,
      });
      return res.status(201).json({
        project,
      });
    } catch (error) {
      next(ApiError.internalError(error));
      return;
    }
  },
  getAllProjects: async (_req, res, next) => {
    try {
      const projects = await ProjectModel.find({});
      return res.status(200).json({
        ...projects,
        count: projects.length,
      });
    } catch (error) {
      next(ApiError.internalError("Something went wrong, please try later"));
      logger.log(error, "error");
      return;
    }
  },
  assignParticipant: async (req, res, next) => {
    const projectId = req.params.projectId;
    const { participant, owner } = req.body;

    if (!participant || !owner) {
      next(ApiError.badRequest("participant and owner fields are required"));
      return;
    }
    const project = await ProjectModel.findOne({
      _id: projectId,
    });
    if (!project) {
      next(ApiError.notFound("Project doesn't exist"));
    }
    const assigner = await employee(owner);
    const assignee = await employee(participant);
    if (assigner.department !== assignee.department) {
      next(
        ApiError.badRequest(
          "Participants must be part of the same department as the Owner"
        )
      );
      return;
    }
    if (project.participants.indexOf(participant) >= 0) {
      next(
        ApiError.badRequest("The Participant is already part to this project")
      );
      return;
    }
    const prjt = await project.updateOne({
      $push: { participants: participant },
      dateTimeUpdated: Date.now(),
    });
    return res.status(200).json({
      ...prjt,
      message: "Assigned Successfully",
    });
  },

  updateProject: async (req, res, next) => {
    const { state, progress } = req.body;
    const id = req.params.projectId;
    const project = await ProjectModel.findOne({
      _id: id.toString(),
    });
    if (!project) {
      next(ApiError.notFound("Project doesn't exist"));
      return;
    }
    if (project.state !== "Active" && progress) {
      next(
        ApiError.badRequest(
          "Can't update Progress f a project, which is not Active"
        )
      );
      return;
    }
    try {
      await ProjectModel.updateOne(
        { _id: id },
        { ...req.body, dateTimeUpdated: Date.now() },
        { runValidators: true }
      );
    } catch (ValidatorError) {
      next(ApiError.badRequest(ValidatorError.message));
      return;
    }
    return res.status(200).json({
      message: "Upated Successfully",
    });
  },
};
