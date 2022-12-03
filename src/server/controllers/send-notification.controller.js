const catchAsync = require('../utils/catch-async')
const User = require('../models/user.model');
const {requestFireBase} = require("../utils/send-to-firebase");


const sendToRole = async (req, res) => {
  const notification = req.body;
  let token = await User.find({}).populate('role');
  for (const user of token) {
    if (user.role) {
      if (user.role.name === "human resources" || user.role.name === "admin") {
        deviceToken.push(user.deviceToken);
      }
    }
  }
  let notification_body = {
    'notification': notification,
    'registration_ids': deviceToken
  }
  await requestFireBase(notification_body)
    .then((response) => {
      res.status(200).send('Notification send successfully')
    }).catch((err) => {
      res.status(400).send('Something went wrong!')
    })
}


const sendAll = async (req, res) => {
  let deviceToken = [];
  const notification = req.body;
  let token = await User.find({});
  for (const user of token) {
    if (user.deviceToken) {
      deviceToken.push(user.deviceToken);
    }
  }
  let notification_body = {
    'notification': notification,
    'registration_ids': deviceToken
  }
  await requestFireBase(notification_body)
    .then((response) => {
      res.json({
        message: "Notification send successfully",
        notification_body
      })
    }).catch((err) => {
      res.status(400).send('Something went wrong!')
    })
};

const sendOne = catchAsync(async (req, res) => {
  const notification = req.body;
  const notification_body = {
    'notification': notification,
    'to': notification.to
  }
  await requestFireBase(notification_body).then((response) => {
    res.json({
      message: "Notification send successfully",
      notification_body
    })
  }).catch((err) => {
    res.status(400).send('Something went wrong!')
  })
})

module.exports = {
  sendAll,
  sendOne,
  sendToRole
}