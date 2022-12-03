const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");
import {slugify} from "../utils/slugify";
const fs = require("fs");
const Task = require("./task.model");
const UserTask = require("./user-task.model");

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  slug: {
    type: String
  }
}, {
  timestamps: true
});

boardSchema.plugin(paginate);
boardSchema.plugin(toJSON);

// TODO: Export as a new module
boardSchema.statics.slugGenerator = async function(projectName) {
  let newSlug = slugify(projectName);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(projectName)}_${++count}`;
  }
  return newSlug;
};

boardSchema.pre('save', async function (next) {
  const board = this;
  if (board.isModified("name")) {
    board.slug = await Board.slugGenerator(board.name);
  }
  next();
});

boardSchema.pre('deleteOne', async function (next) {
  const board = this;
  const tasks = await Task.deleteMany({board: board._id});
  await UserTask.deleteMany({task:  tasks.map(task => task._id)});
  next();
});

const Board =mongoose.models.Board || mongoose.model(
  "Board",
  boardSchema
);

module.exports = Board;