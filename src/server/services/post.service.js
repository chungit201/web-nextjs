const {Post, Comment, Reaction} = require('../models')
const ApiError = require("../utils/api-error");
const httpStatus = require("http-status");

const createPost = async (postBody) => {
  const createdPost = await Post.create(postBody);
  let post = await Post.findOne(createdPost).populate({
    path: "author",
    model: "User",

  });
  post = {
    ...post._doc,
    createdAt: new Date(post.createdAt).getTime(),
    replyCount: 0,
  };

  return post;
}
/**
 * Query post
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {ObjectId} userId - Pagination userId
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page]  Current page (default = 1)
 * @returns {Promise<Object>}
 */
const queryPost = async (filter, options, userId = null) => {
  Object.assign(options, {
    populate: 'author',
    filter: {author: {select: "username fullName avatar email internalEmail deviceToken"}}
  });
  if (!filter.privacy) filter.privacy = "public";
  const posts = await Post.paginate(filter, options);
  for (let i = 0; i < posts.results.length; i++) {
    posts.results[i] = {
      ...posts.results[i]._doc,
      createdAt: new Date(posts.results[i].createdAt).getTime(),
      replyCount: await Comment.countDocuments({post: posts.results[i].id}),
      reactionCount: await Reaction.countDocuments({post: posts.results[i].id}),
      isReacted: await Reaction.countDocuments({post: posts.results[i].id, user: userId}) > 0
    }
  }
  return {
    ...posts
  }
}

/**
 * Update
 * @param {ObjectId} postId
 * @param {ObjectId} userId
 * @return {Promise<Post>}
 */
const getPostById = async (postId, userId) => {
  const post = await Post.findById(postId);
  post.totalPostComments = await Comment.countDocuments({post: postId})
  post.reactionCount = await Reaction.countDocuments({post: post.id});
  post.isReacted = await Reaction.countDocuments({post: post.id, user: userId}) > 0;
  return post;
}

const editPost = async (postId, updateBody, user) => {
  const post = await Post.findOne({_id: postId}).populate({
    path: "author",
    model: "User",
    select: "username fullName avatar email internalEmail"
  });

  if (post.author._id.toString() !== user._id.toString() && !user.role.permissions.includes("MANAGE_ALL_POST" || "UPDATE_ALL_POST")) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden")
  }

  if (updateBody.title === "") {
    throw new ApiError(httpStatus.NOT_FOUND, 'Title is required');
  }
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  Object.assign(post, updateBody);
  return post.save();
};

const deletePost = async (postId, user) => {
  const hasPermission = user.role.permissions.includes("MANAGE_ALL_POST" || "DELETE_ALL_POST");

  const post = await Post.findOne({_id: postId});
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (user._id.toString() !== post.author.toString() && !hasPermission) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  await post.deleteOne();
  return post;
}

const getComments = async (filter, options) => {
  if (await Post.countDocuments({_id: filter.postId}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  filter.level = 1;
  options.populate = "user,tag";

  if (filter.replyFor) {
    const check = (await Comment.findOne({post: filter.postId, replyFor: filter.replyFor}))
    filter.level = check.level;
  }

  const result = await Comment.paginate({post: filter.postId, replyFor: filter.replyFor}, options);

  for (let i = 0; i < result.results.length; i++) {
    const replyCount = await Comment.countDocuments({replyFor: result.results[i].id})
    result.results[i] = {
      ...result.results[i]._doc,
      createdAt: new Date(result.results[i].createdAt).getTime(),
      replyCount
    };
  }

  return {
    ...result,
  };
}

module.exports = {
  createPost,
  getPostById,
  queryPost,
  editPost,
  deletePost,
  getComments
}
