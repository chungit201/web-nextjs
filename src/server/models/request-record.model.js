const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");
const {approval} = require("../config/request.config");

const reqSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    enum: approval.value,
    default: approval.default
  },
  date: {
    type: String
  },
}, {
  timestamps: true
});

reqSchema.plugin(paginate);
reqSchema.plugin(toJSON);

reqSchema.pre('findOne', async function (next) {
  next();
});

reqSchema.pre('save', async function (next) {
  next();
});

const RequestRecord =mongoose.models.RequestRecord || mongoose.model(
  "RequestRecord",
  reqSchema
);

module.exports = RequestRecord;