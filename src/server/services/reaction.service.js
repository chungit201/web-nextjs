const {Post, Reaction} = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");

/**
 * Give reaction to  post
 * @param {ObjectId} userId
 * @param {Object} reactionBody
 * @return {Promise<>}
 */
const handleReaction = async (userId, reactionBody) => {
  Object.assign(reactionBody, {user: userId});

  if (await Post.countDocuments({_id: reactionBody.post}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  let reaction = await Reaction.findOne({user: userId, post: reactionBody.post});
  if (!reaction) {
    reaction = await Reaction.create(reactionBody);
  }
  if (reaction && reactionBody.state === 'update') {
    Object.assign(reaction, reactionBody)
    await reaction.save();
  }

  if (reaction && reactionBody.state === 'remove') {
    await reaction.deleteOne();
  }
  return reaction;
}

module.exports = {
  handleReaction
}