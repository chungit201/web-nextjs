const Joi = require('joi');
const { ObjectId } = require("./custom.validations");

const addComment = {
  body: Joi.object().keys({
    user: Joi.string().custom(ObjectId).required(),
    content: Joi.string().required().required(),
    replyFor: Joi.string().custom(ObjectId),
    post: Joi.string().custom(ObjectId),
    request: Joi.string().custom(ObjectId),
    tag: Joi.string().custom(ObjectId)
  })
}

const getComments = {
  query: Joi.object().keys({
    user: Joi.string().custom(ObjectId),
    content: Joi.string()
  })
}

const getComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(ObjectId).required()
  })
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    user: Joi.string().custom(ObjectId),
    content: Joi.string(),
    replyFor: Joi.string().custom(ObjectId),
    dueDate: Joi.string(),
  })
};

const deleteComments = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  getComment,
  updateComment,
  addComment,
  getComments,
  deleteComments
}