import {PostService} from 'server/services';
import pick from "server/utils/pick";

export const addPost = async (req, res) => {
  req.body.author = req.user._id;
  const posts = await PostService.createPost(req.body);

  res.json({
    message: "Create successfully",
    posts: posts
  });
};

export const getPosts = async (req, res) => {
  const userId = req.user.id;
  const filter = pick(req.query, ['title', 'author', 'project', 'privacy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await PostService.queryPost(filter, options, userId);
  res.json(result);
};

export const getPost = async (req, res) => {
  const post = await PostService.getPostById(req.query.postId, req.user.id)
  res.json(post)
};

export const updatePost = async (req, res) => {
  const post = await PostService.editPost(req.query.postId, req.body, req.user);
  res.json({
    message: "Update post successfully",
    post: post,
  })
};

export const removePost = async (req, res) => {
  const post = await PostService.deletePost(req.query.postId, req.user);
  res.send({
    message: "Deleted post successfully",
    post: post
  });
};

export const getComments = async (req, res) => {
  const filter = pick(req.query, ["replyFor"]);
  filter.postId = req.query.postId;
  const options = pick(req.query, ["sortBy", "limit", "page"])

  res.json(await PostService.getComments(filter, options));
};