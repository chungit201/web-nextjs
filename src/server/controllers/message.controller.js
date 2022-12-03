const catchAsync = require('../utils/catch-async');
const pick = require('../utils/pick')
const {messageService} = require("../services");

const addMessage = catchAsync(async (req, res) => {
  const message = await messageService.createMessage(req.body);
  res.json({
    info: "Create Notification successFully",
    message: message
  })
})

const getMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['sender', 'receiver', 'dialogId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const messages = await messageService.queryMessage(filter, options);
  res.json(messages)
});

const removeMessage = catchAsync(async (req, res) => {
  const message = await messageService.deleteMessage(req.params.messageId);
  res.json({
    message: "Delete notification successFully",
    notificationDelete: message
  });
});

module.exports = {
  addMessage,
  getMessages,
  removeMessage
}
