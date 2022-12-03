const mongoose = require('mongoose');
const IssueLabel = require("./issue-label.model");
import {slugify} from "../utils/slugify";
const {paginate, toJSON} = require("./plugins");

const labelSchema = new mongoose.Schema({
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
  color: {
    type: String
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
}, {
  collection: 'labels',
  timestamps: true
});

labelSchema.plugin(paginate);
labelSchema.plugin(toJSON);

/**
 * Slug generator
 * @param {string} labelName - The label's name
 * @returns {Promise<string>}
 */
labelSchema.statics.slugGenerator = async function(labelName) {
  let newSlug = slugify(labelName);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(labelName)}_${++count}`;
  }
  return newSlug;
};

labelSchema.pre('save', async function (next) {
  const label = this;
  if (label.isModified("name")) {
    label.slug = await Label.slugGenerator(label.name);
  }
  next();
});

// will call before remove method => cascading delete all label model references
labelSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const label = this;
  await IssueLabel.deleteMany({label: label._id});
  next();
});

/**
 * @typedef Label
 */
const Label =mongoose.models.Label || mongoose.model(
  "Label",
  labelSchema
);

module.exports = Label;