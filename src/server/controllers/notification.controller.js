const catchAsync = require("../utils/catch-async");
const pick = require("../utils/pick");
const {notificationService} = require("../services");
const {Notification} = require("../models");

const addNotification = catchAsync(async(req,res)=>{
  const notifications = await notificationService.createNotification(req.body);
  res.json({
    message: "Create notification successFully",
    notifications: notifications
  })
})

const getNotifications = catchAsync(async (req,res)=>{
  const filter = pick(req.query, ['sender', 'receiver','isSeen']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const notifications = await notificationService.queryNotification(filter,options);
  res.json(notifications)
});

const seenAll = catchAsync(async (req,res) => {
  const updateSeen = await Notification.updateMany({isSeen: false}, {
    isSeen: true
  });
  res.json({
    message:"Seen to all successfully"
  })
})

const getNotification = catchAsync(async (req,res)=>{
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  res.json(notification);
});

const editNotification = catchAsync(async(req,res)=>{
  const notification = await notificationService.updateNotification(req.params.notificationId, req.body);
  res.json({
    message: "update notification successFully",
    notification: notification,
  })
})
const removeNotification = catchAsync(async (req,res)=>{
  const notification = await notificationService.deleteNotification(req.params.notificationId);
  res.json({
    message: "Delete notification successFully",
    notificationDelete: notification
  });
});

module.exports = {
  seenAll,
  addNotification,
  getNotifications,
  getNotification,
  editNotification,
  removeNotification,
}
