const mongoose = require('mongoose');
const {paginate, toJSON} = require('./plugins');
const User = require("./user.model");

const deviceTokenSchema = new mongoose.Schema({
  tokens: {
    type:String,
    require:true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }

},{timestamps:true});

deviceTokenSchema.plugin(paginate);
deviceTokenSchema.plugin(toJSON);




const DeviceToken =mongoose.models.DeviceToken || mongoose.model('DeviceToken',deviceTokenSchema);
module.exports = DeviceToken;
