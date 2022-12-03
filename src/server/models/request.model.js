const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");
const {types, state, departments} = require("../config/request.config");

const requestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  state: {
    type: String,
    enum: state.value,
    default: state.default
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: types.value,
    default: types.default
  },
  toDepartment: {
    type: String,
    enum: departments.value,
    default: departments.default
  },
  deleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

requestSchema.plugin(paginate);
requestSchema.plugin(toJSON);

requestSchema.pre('findOne', async function (next) {
  next();
});

requestSchema.pre('save', async function (next) {
  next();
});

const Request =mongoose.models.Request || mongoose.model(
  "Request",
  requestSchema
);

module.exports = Request;