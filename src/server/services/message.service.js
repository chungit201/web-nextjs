const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const {Message} = require("../models");

const createMessage = async (messageBody) => {
  return Message.create(messageBody);
}

const queryMessage = async (filter, options) => {
  Object.assign(options, {
    populate: 'sender,receiver',
    filter: {
      sender: {
        select: '_id username email fullName'
      },
      receiver: {
        select: '_id username email fullName'
      }
    }
  });
  return Message.paginate(filter, options);
}

const deleteMessage = async (messageId)=>{
  let message = await Message.findOne({_id: messageId});
  if(!message){
    throw new ApiError(httpStatus.NOT_FOUND,'message not found');
  }
  await Message.deleteOne();
  return message;
}

module.exports = {
  createMessage,
  queryMessage,
  deleteMessage
}
