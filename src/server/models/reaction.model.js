const mongoose = require('mongoose');
const {paginate, toJSON} = require("./plugins");
const {reaction} = require("../config/post.config");

const reactionSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: reaction.name,
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  collection: 'reactions',
  timestamps: true
});

reactionSchema.plugin(paginate);
reactionSchema.plugin(toJSON);

/**
 * @typedef Reaction
 */
const Reaction =mongoose.models.Reaction || mongoose.model(
  "Reaction",
  reactionSchema
);

module.exports = Reaction;