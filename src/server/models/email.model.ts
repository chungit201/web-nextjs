const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  creationTime: Number,
  sender: String,
  from: String,
  recipient: String,
  subject: String,
  data: Object,
  strippedText: String,
  bodyHTML: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
});

/**
 * @typedef Email
 */
const Email = mongoose.models.Email || mongoose.model('Email', emailSchema);

export default Email;


