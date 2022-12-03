const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");

const ulSchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true
  },
  label: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Label",
    required: true
  }
}, {
  collection: 'issuelabel',
  timestamps: true
});

ulSchema.plugin(paginate);
ulSchema.plugin(toJSON);

/**
 * @typedef IssueLabel
 */
const IssueLabel =mongoose.models.IssueLabel || mongoose.model(
  "IssueLabel",
  ulSchema
);

module.exports = IssueLabel;
