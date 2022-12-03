const mongoose = require('mongoose');
const {paginate, toJSON} = require("./plugins");

const questionSchema = new mongoose.Schema({
  content: {
    type: String
  },
  sampleForm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true
  },
}, {
  collection: 'questions',
  timestamps: true
});

questionSchema.plugin(paginate);
questionSchema.plugin(toJSON);

/**
 * @typedef Question
 */
const Question =mongoose.models.Question || mongoose.model(
  "Question",
  questionSchema
);

module.exports = Question;