const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");

const upSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  isMaintainer: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'userprojects',
  timestamps: true
});

upSchema.plugin(paginate);
upSchema.plugin(toJSON);

/**
 * @typedef UserProject
 */
const UserProject =mongoose.models.UserProject || mongoose.model(
  "UserProject",
  upSchema
);

module.exports = UserProject;
