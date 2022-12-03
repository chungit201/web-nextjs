const mongoose = require('mongoose');
import {slugify} from "../utils/slugify";
const {paginate, toJSON} = require("./plugins");
const {repeat} = require("../config/form.config");
const Question = require("./question.model");

const sformSchema = new mongoose.Schema({
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
  repeat: {
    type: String,
    enum: repeat.values,
    default: repeat.default
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  collection: 'sampleforms',
  timestamps: true
});

sformSchema.plugin(paginate);
sformSchema.plugin(toJSON);

/**
 * Slug generator
 * @param {string} formName - The form's name
 * @returns {Promise<string>}
 */
sformSchema.statics.slugGenerator = async function(formName) {
  let newSlug = slugify(formName);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(formName)}_${++count}`;
  }
  return newSlug;
};

sformSchema.pre('save', async function (next) {
  const form = this;
  if (form.isModified("name")) {
    form.slug = await SampleForm.slugGenerator(form.name);
  }
  next();
});

// will call before remove method => cascading delete all question model references
sformSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const form = this;
  await Question.deleteMany({sampleForm: form._id});
  next();
});

/**
 * @typedef SampleForm
 */
const SampleForm =mongoose.models.SampleForm || mongoose.model(
  "SampleForm",
  sformSchema
);

module.exports = SampleForm;