const catchAsync = require('../utils/catch-async');
const {Request, UserRequest} = require("../models");
const {requestService, emailService, CommentService: commentService} = require('../services');
const pick = require("../utils/pick");
const ApiError = require("../utils/api-error");
const httpStatus = require("http-status");

const sendRequest = catchAsync(async (req, res) => {
  req.body.sender = req.user._id;
  const data = await requestService.sendRequest(req.body);
  res.json({
    message: `Sent request to ${(data.receivers.length > 0) ? ((data.receivers.length === 1) ? data.receivers[0].fullName : data.receivers.length + " users") + " successfully" : 0 + " user"} `,
  });

  for (const receiver of data.receivers) {
    emailService.sendEmail({
      receiver: receiver.internalEmail,
      subject: `A request from ${req.user.fullName}`,
      content: `Dear ${receiver.fullName},<br><br>You have a request from ${req.user.fullName}.<br><br>Click on this link for more detail: https://northstudio.dev/app/requests/inbox/${data.requestId}<br><br>Best regards.`
    }).then(_ => {
    });
  }

  setTimeout(async () => {
    await Request.updateOne({_id: data.requestId}, {state: "rejected"});
    emailService.sendEmail({
      receiver: req.user.internalEmail,
      subject: `Reply to request of ${req.user.fullName}`,
      content: `Dear ${req.user.fullName},<br><br>Your request was rejected due to not being processed after 24 hours.<br><br>Click on this link for more detail: https://northstudio.dev/app/requests/inbox/${data.requestId}<br><br>Best regards.`
    }).then(_ => {
    });
  }, 3600 * 24 * 1000);
});


const getRequests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['subject', 'content', 'state']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const {placeholder} = req.query;
  let result;
  if (placeholder) {
    switch (placeholder) {
      case "inbox":
        filter['receiver'] = req.user._id
        result = await requestService.getIncomingRequests(filter, options);
        break;
      case "sent":
        filter['sender'] = req.user._id
        result = await requestService.getSentRequests(filter, options);
        break;
    }
  } else if (req.user.role.permissions.includes("MANAGE_ALL_REQUEST")) {
    result = await requestService.getSentRequests(filter, options);
  }

  res.json(result);
});

const getRecords = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['request', 'receiver', 'date', 'action']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await requestService.getRecords(filter, options);
  res.json(result);
});

const getRequest = catchAsync(async (req, res) => {
  const requestId = req.query.requestId;
  let filter = null;
  const {placeholder} = req.query;
  if (placeholder) {
    switch (placeholder) {
      case "inbox":
        filter = {_id: requestId, receiver: req.user._id}
        break;
      case "sent":
        filter = {_id: requestId, sender: req.user._id}
        break;
      case "all":
        if (req.user.role.permissions.includes("MANAGE_ALL_REQUEST")) {
          filter = {_id: requestId}
        }
        break;
    }
  }
  const result = await requestService.getRequest(filter);
  res.json(result);
});

const getDeletedRequests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['subject', 'content', 'state']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let result = await requestService.getDeletedRequests(filter, options);
  res.json(result);
});

const getComment = catchAsync(async (req, res) => {
  const requestId = req.query.requestId;
  const filter = {request: requestId}
  const options = pick(req.query, ["sortBy", "page", "limit"])
  const result = await commentService.queryComment(filter, options);
  res.json(result);
});

const updateRequest = catchAsync(async (req, res) => {
  const requestId = req.query.requestId;

  const isMaintainer = await UserRequest.findOne({request: requestId, receiver: req.user._id, hasPriority: true});
  if (!req.user.role.permissions.includes('MANAGE_ALL_REQUEST') && !isMaintainer) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  const request = await requestService.updateRequest(requestId, req.body);

  res.send({
    message: `Updated request successfully`,
    request
  });
});

const approvalRequest = catchAsync(async (req, res) => {
  const request = await requestService.approvalRequest(req.query.requestId, req.user._id, req.body);
  if (request.state === 'resolved' || request.state === 'rejected') {
    emailService.sendEmail({
      receiver: request.sender.internalEmail,
      subject: `Reply to request from ${req.user.fullName}`,
      content: `Dear ${request.sender.fullName},<br><br>Your request has been ${request.state} by ${req.user.fullName}.<br><br>Click on this link for more detail: https://northstudio.dev/app/requests/sent/${request._id}<br><br>Best regards.`
    }).then(() => {});
  }
  res.send({
    message: "Approval request successfully",
    request
  })
});

const deleteRequest = catchAsync(async (req, res) => {
  const request = await requestService.deleteRequest(req.query.requestId);
  res.send({
    message: "Deleted request successfully",
    request
  })
});

const restoreRequests = catchAsync(async (req, res) => {
  let requests = !Array.isArray(req.body.requests) ? [req.body.requests] : req.body.requests;
  const result = await requestService.restoreRequests(requests);
  res.send({
    message: "Restore requests successfully",
    result: result
  })
});

module.exports = {
  sendRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  getComment,
  restoreRequests,
  getDeletedRequests,
  getRecords,
  approvalRequest,
}
