const mongoose = require('mongoose');
const {paginate, toJSON} = require("./plugins");
const {repeat} = require("../config/form.config");
const Answer = require("./answer.model");

const formSchema = new mongoose.Schema({
  sampleForm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SampleForm",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, {
  collection: 'forms',
  timestamps: true
});

formSchema.plugin(paginate);
formSchema.plugin(toJSON);

// will call before remove method => cascading delete all answer model references
formSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const form = this;
  await Answer.deleteMany({form: form._id});
  next();
});

/**
 * @typedef Form
 */
const Form =mongoose.models.Form || mongoose.model(
  "Form",
  formSchema
);

module.exports = Form;