const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");
const {roles} = require("../config/event.config");

const ueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  role: {
    type: String,
    enum: roles.values,
    default: roles.default
  }
}, {
  collection: 'userevents',
  timestamps: true
});

ueSchema.plugin(paginate);
ueSchema.plugin(toJSON);

/**
 * @typedef UserEvent
 */
const UserEvent = mongoose.models.UserEvent || mongoose.model(
  "UserEvent",
  ueSchema
);

module.exports = UserEvent;
