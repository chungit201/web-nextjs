const Joi = require('joi');
const { ObjectId } = require('./custom.validations');

const addPost = {
  body: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string().required(),
    privacy: Joi.string(),
    author: Joi.string().custom(ObjectId),
    file: Joi.string()
  })
}

const getPosts = {
  query: Joi.object().keys({
    title: Joi.string().custom(ObjectId),
    content: Joi.string(),
    author: Joi.string().custom(ObjectId),
    limit: Joi.number().integer(),
    privacy: Joi.string(),
    page: Joi.number().integer(),
    sortBy: Joi.string()
  })
};

const getPost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(ObjectId).required()
  })
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
    author: Joi.string().custom(ObjectId),
    privacy: Joi.string(),
    file: Joi.string(),
    reaction: Joi.string().custom(ObjectId)
  })
};

const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(ObjectId).required()
  }),
}

module.exports = {
  getPost,
  addPost,
  getPosts,
  updatePost,
  deletePost
}
