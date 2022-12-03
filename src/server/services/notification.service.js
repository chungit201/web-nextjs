const {Notification, Comment} = require('../models')
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const createNotification = async (notificationBody) => {
  return Notification.create(notificationBody);
};

const queryNotification = async (filter, options) => {
  Object.assign(options, {
    populate: 'sender,receiver',
    filter: {
      sender: {
        select: '_id username email fullName avatar'
      },
      receiver: {
        select: '_id username email fullName avatar'
      },
    }
  });
  return Notification.paginate(filter, options);
}

const getNotificationById = async (notificationId) => {
  let notification = await Notification.findOne({_id: notificationId});
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  return notification;
};
const updateNotification = async (notificationId, notificationBody) => {
  let notification = await Notification.findOne({_id: notificationId});
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  Object.assign(notification, notificationBody);
  notification.save();
  return notification;
}

const deleteNotification = async (notificationId) => {
  let notification = await Notification.findOne({_id: notificationId});
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  await notification.deleteOne();
  return notification;
}

module.exports = {
  createNotification,
  queryNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
}