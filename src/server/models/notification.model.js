const mongoose = require('mongoose');
const {paginate, toJSON} = require("./plugins");
const {type} = require('../config/notification.config')

const notificationSchema = new mongoose.Schema({

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  click_action: {
    type: String,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  action: {
    type: String,
    enum: type.values,
    require: true
  },

  notificationBy: {
    type: mongoose.Schema.Types.ObjectId,
    require:true,
  },

  isSeen: {
    type: Boolean,
    default: false,
  },

  type:{
    type:String,
  },
  date:{
    type:String,
  }

}, {timestamps: true});

notificationSchema.pre('save', async function (next) {
  const notification = this;
  next();
})

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate)

const Notification =mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
module.exports = Notification;