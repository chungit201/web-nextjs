const {Comment, User, Post, Request} = require('../models')
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");

const createComment = async (commentBody) => {
  if (commentBody.post && await Post.countDocuments({_id: commentBody.post}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  if (commentBody.request && await Request.countDocuments({_id: commentBody.request}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (await User.countDocuments({_id: commentBody.user}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found")
  }

  const createdComment = await Comment.create(commentBody);

  let comment = await Comment.findOne({_id: createdComment._id.toString()}).populate([
    {path: "user", model: "User"},
    {path: "tag", model: "User", select: "username fullName createdAt"}
  ]);
  comment = {...comment._doc, createdAt: new Date(comment.createdAt).getTime(), replyCount: 0};
  return comment
}
/**
 * Query comment
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] Current page (default = 1)
 * @returns {Promise<QueryResult[options.page] >}
 */
const queryComment = async (filter, options) => {
  Object.assign(options, {populate: 'user,replyFor,tag', filter: {user: {select: "username fullName avatar email internalEmail deviceToken"}}});
  return Comment.paginate(filter, options);
}

/**
 * Update
 * @param {ObjectId} commentId
 * @return {Promise<Comment>}
 */
const getCommentById = async (commentId) => {
  const comment = await Comment.findOne({_id: commentId});
  if (comment && !comment.replyFor) {
    comment.subComments = await Comment.find({replyFor: comment.id});
  }
  return comment;
}

const editComment = async (commentId, updateBody) => {
  const comment = await Comment.findOne({_id: commentId});
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  Object.assign(comment, updateBody);
  await comment.save();
  return comment;
};

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findOne({_id: commentId, user: userId});
  if (!comment) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Cannot delete this comment');
  }
  await comment.deleteOne();
  return comment;
}
module.exports = {
  createComment,
  getCommentById,
  queryComment,
  editComment,
  deleteComment
}
