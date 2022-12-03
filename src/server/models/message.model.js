const mongoose = require('mongoose');
import {slugify} from "../utils/slugify";
const {paginate, toJSON} = require("./plugins");

const messageSchema = new mongoose.Schema({
  dialog:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Dialog',
    required:true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId.schemaName,
    ref: 'User'
  },
  text: {
    type: String,
    required: true,
    maxlength:300
  },
  msgType:{
    type:String,
  }
}, {timestamps: true});

messageSchema.plugin(paginate);
messageSchema.plugin(toJSON);

const Message =mongoose.models.Message || mongoose.model('Message', messageSchema);
module.exports = Message;
