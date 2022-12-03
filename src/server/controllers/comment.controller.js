const {CommentService} = require('server/services');
const pick = require("server/utils/pick");

export const addComment = async (req, res) => {
  const comments = await CommentService.createComment(req.body);
  res.json({
    message: "Added comment successfully",
    comments: comments
  });
};

export const getComments = async (req, res) => {
  const filter = pick(req.query, ['request', 'post', 'replyFor']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await CommentService.queryComment(filter, options);
  res.json(result)
};

export const getComment = async (req, res) => {
  const comment = await CommentService.getCommentById(req.query.commentId)
  res.json(comment);
};

export const updateComment = async (req, res) => {
  const comment = await CommentService.editComment(req.query.commentId, req.body);
  res.json({
    message: "Updated comment successfully",
    comment: comment,
  })
};

export const deleteComment = async (req, res) => {
  const userId = req.user._id;
  const comment = await CommentService.deleteComment(req.query.commentId, userId);
  res.json({
    message: "Deleted comment successfully",
    comment: comment
  });
};