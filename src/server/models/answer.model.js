const mongoose = require('mongoose');
const {paginate, toJSON} = require("./plugins");

const answerSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true
  },
  content: {
    type: String,
  }
}, {
  collection: 'answers',
  timestamps: true
});

answerSchema.plugin(paginate);
answerSchema.plugin(toJSON);

/**
 * @typedef Answer
 */
const Answer =mongoose.models.Answer || mongoose.model(
  "Answer",
  answerSchema
);

module.exports = Answer;