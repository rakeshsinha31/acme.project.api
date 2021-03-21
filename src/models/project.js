const mongoose = require("mongoose");

const PROJECT_STATES = {
  values: ["Planned", "Active", "Done", "Failed"],
  message: "State is either Planned, Active, Done, Failed",
};

const ProjectSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: String,
      required: true,
    },
    participants: {
      type: [String],
      default: [],
    },
    state: {
      type: String,
      default: PROJECT_STATES.values[0],
      validate: {
        validator: (val) => {
          return PROJECT_STATES.values.indexOf(val) > -1;
        },
        message: PROJECT_STATES.message,
      },
      progress: {
        type: Number,
        min: 0,
        max: 100,
      },
      dateTimeCreated: {
        type: Date,
        default: Date.now,
      },
      dateTimeUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { _id: false }
);

ProjectSchema.index({ name: 1 });

module.exports = mongoose.model("ProjectModel", ProjectSchema);
