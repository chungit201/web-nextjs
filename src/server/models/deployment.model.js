const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
  creationTime: Date,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  port: Number,
  framework: String,
  path: {
    type: String
  },
  status: {
    type: String
  },
  deploymentLog: String,
  runtimeLog: String,
  errLog: String
}, {
  timestamps: true
});

/**
 * @typedef Project
 */
const Deployment = mongoose.model(
  "Deployment",
  deploymentSchema
);

module.exports = Deployment;
