const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");

const utSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  }
}, {
  collection: 'usertasks',
  timestamps: true
});

utSchema.plugin(paginate);
utSchema.plugin(toJSON);

/**
 * @typedef UserTask
 */
const UserTask = mongoose.models.UserTask || mongoose.model('UserTask', utSchema)

module.exports = UserTask;
