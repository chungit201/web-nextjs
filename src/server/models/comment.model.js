const mongoose = require('mongoose')
const {paginate, toJSON} = require('./plugins');
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  replyFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  level: {
    type: Number,
    default: 1
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
  },
}, {timestamps: true})

commentSchema.plugin(paginate);
commentSchema.plugin(toJSON);

commentSchema.pre("save", async function (next) {
  const comment = this;

  if (comment.replyFor) {
    const replyFor = await Comment.findOne({_id: comment.replyFor})
    if (!replyFor) {
      throw new ApiError(httpStatus.NOT_FOUND, "Comment not found")
    }
    if (replyFor.level < 3) {
      comment.level = ++replyFor.level
    }
    if(replyFor.level === 3) {
      comment.level = 3
    }
  }

  next();
});

/**
 * @typedef Comment
 */
const Comment =mongoose.models.Comment || mongoose.model('Comment', commentSchema);

module.exports = Comment;


