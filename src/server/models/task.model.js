const mongoose = require('mongoose');
const UserTask = require("./user-task.model");
import {slugify} from "../utils/slugify";
const {paginate, toJSON} = require("./plugins");
const {state} = require("../config/project.config");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  description: {
    type: String
  },
  startDate: {
    type: String,
    required: true
  },
  dueDate: {
    type: String
  },
  state: {
    type: String,
    enum: state.values,
    default: state.default
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  }
}, {
  collection: 'tasks',
  timestamps: true
});

taskSchema.plugin(paginate);
taskSchema.plugin(toJSON);

/**
 * Slug generator
 * @param {string} taskName - The task's name
 * @returns {Promise<string>}
 */
taskSchema.statics.slugGenerator = async function(taskName) {
  let newSlug = slugify(taskName);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(taskName)}_${++count}`;
  }
  return newSlug;
};

taskSchema.pre('save', async function (next) {
  const task = this;
  if (task.isModified("name")) {
    task.slug = await Task.slugGenerator(task.name);
  }
  next();
});

// will call before remove method => cascading delete all task model references
taskSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const task = this;
  await UserTask.deleteMany({task: task._id});
  next();
});

/**
 * @typedef Task
 */
const Task =mongoose.models.Task || mongoose.model(
  "Task",
  taskSchema
);

module.exports = Task;