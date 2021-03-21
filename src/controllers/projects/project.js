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
    const projectName = await ProjectModel.findOne({ name });
    if (projectName) {
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
};
