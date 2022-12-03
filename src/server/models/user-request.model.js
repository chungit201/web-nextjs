const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");
const {state, approval} = require('../config/request.config');

const userRequestSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  hasPriority: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  approval: {
    type: String,
    enum: approval.value,
    default: approval.default
  },
}, {
  timestamps: true
});

userRequestSchema.plugin(paginate);
userRequestSchema.plugin(toJSON);

const UserRequest =mongoose.models.UserRequest || mongoose.model(
  "UserRequest",
  userRequestSchema
);

module.exports = UserRequest;