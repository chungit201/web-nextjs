const {ObjectId} = require("./custom.validations");
const Joi = require('joi');

const addMember = {
  body: Joi.object().keys({
    dialog: Joi.string().custom(ObjectId).required(),
    user: Joi.string().custom(ObjectId).required(),
    nickname: Joi.string()
  })
}

const getMembers = {
  query: Joi.object().keys({
    user: Joi.string().custom(ObjectId),
    dialog: Joi.string().custom(ObjectId),
  })
};

const getMember = {
  params: Joi.object().keys({
    memberId: Joi.string().custom(ObjectId).required()
  }),
}

const updateMember = {
  params: Joi.object().keys({
    memberId: Joi.custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    user:Joi.custom(ObjectId),
    nickname : Joi.string()
  })
};

const deleteMember = {
  params: Joi.object().keys({
    memberId: Joi.string().custom(ObjectId).required()
  }),
}

module.exports = {
  addMember,
  getMember,
  getMembers,
  updateMember,
  deleteMember
}
