const Joi = require('joi');
const { ObjectId } = require('./custom.validations');

const addNotification = {
  body: Joi.object().keys({
    sender: Joi.string().custom(ObjectId).required(),
    receiver: Joi.string().custom(ObjectId),
    action: Joi.string(),
    count: Joi.number(),
    isSeen: Joi.boolean(),
    notificationBy: Joi.string().custom(ObjectId).required(),
    date: Joi.string()
  })
}

const getNotifications = {
  query: Joi.object().keys({
    sender: Joi.string().custom(ObjectId),
    receiver: Joi.string().custom(ObjectId),
    action: Joi.string(),
  })
};

const editNotification = {
    params: Joi.object().keys({
      notificationId: Joi.string().custom(ObjectId).required()
    })
}

const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(ObjectId).required()
  })
};

const deleteNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(ObjectId).required()
  }),
}

module.exports = {
  addNotification,
  getNotifications,
  getNotification,
  editNotification,
  deleteNotification
}
