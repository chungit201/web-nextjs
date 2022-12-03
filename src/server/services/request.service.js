const {Request, User, UserRequest, RequestRecord} = require('../models')
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const pick = require("../utils/pick");

/**
 * Send Request
 * @param {Object} requestBody - Body for creating request
 * @returns {Promise}
 */
const sendRequest = async (requestBody) => {
  const requestFields = pick(requestBody, ['sender', 'subject', 'content', 'type', 'toDepartment']);
  let userArr = [];
  const request = await Request.create(requestFields);
  if (!requestBody.toDepartment || (requestBody.toDepartment && requestBody.toDepartment === "individual")) {
    if (!requestBody.receiver) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Receiver is required");
    }

    if (await User.countDocuments({_id: requestBody.receiver}) <= 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    let userRequestFields = {
      request: request._id,
      receiver: requestBody.receiver,
      hasPriority: true
    };
    await UserRequest.create(userRequestFields);
    // if (requestBody.ccUsers) {
    //   for (const user of requestBody.ccUsers) {
    //     if (requestBody.ccUsers.length > 5) break;
    //     if (await User.countDocuments({_id: user}) > 0 && user !== requestBody.receiver) {
    //       userRequestFields = {...userRequestFields, receiver: user, hasPriority: false};
    //       await UserRequest.create(userRequestFields);
    //     }
    //   }
    // }
    userArr = /*(requestBody.ccUsers) ? [...requestBody.ccUsers, requestBody.receiver] : */[requestBody.receiver];
  } else {
    userArr = (await User.find({department: requestBody.toDepartment}).lean()).map(user => user._id);
    for (const user of userArr) {
      if (await User.countDocuments({_id: user}) > 0 && user !== requestBody.receiver) {
        await UserRequest.create({
          request: request._id,
          receiver: user,
          hasPriority: true
        });
      }
    }
  }

  return {
    requestId: request._id,
    receivers: (await User.find({_id: {$in: userArr}}).select("username internalEmail fullName").lean())
  }
}

// const getRequests = async (filter, options) => {
//   Object.assign(options, {populate: 'sender', filter: {sender: {select: "username fullName email internalEmail"}}});
//   const request = await Request.paginate(filter, options);
//
//
// }

/**
 * Query Request
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] Current page (default = 1)
 * @returns {Promise<QueryResult[options.page] >}
 */
const getSentRequests = async (filter, options) => {
  Object.assign(filter, {deleted: {$ne: true}});
  Object.assign(options, {populate: 'sender', filter: {sender: {select: "username avatar fullName email internalEmail"}}});
  let requests = await Request.paginate(filter, options);
  for (let i = 0; i < requests.results.length; i++) {
    const sentTo = (await UserRequest.find({request: requests.results[i]._id})
      .populate({path: "receiver", model: "User", select: "username fullName avatar email internalEmail"})
      .lean())
      .map(req => {
        return {
          ...req.receiver,
          hasPriority: req.hasPriority
        }
      });
    requests.results[i] = {
      ...requests.results[i]._doc,
      sentTo
    }
  }
  return requests;
}

/**
 * Query Request
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] Current page (default = 1)
 * @returns {Promise<QueryResult[options.page] >}
 */
const getIncomingRequests = async (filter, options) => {
  let requestFilter = pick(filter, ['receiver']);
  filter = {
    ...filter,
    _id: {$in: (await UserRequest.find(requestFilter)).map(req => req.request)}
  };
  return getSentRequests(filter, options);

}

/**
 * Query Request's record
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] Current page (default = 1)
 * @returns {Promise<QueryResult[options.page] >}
 */

const getRecords = async (filter, options) => {
  Object.assign(options, {
    populate: "request,receiver",
    filter: {receiver: {select: "username fullName avatar email internalEmail"}},
  });
  return RequestRecord.paginate(filter, options);
}

/**
 * Get deleted Requests
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] Current page (default = 1)
 * @returns {Promise<QueryResult >}
 */
const getDeletedRequests = async (filter, options) => {
  Object.assign(filter, {deleted: true});
  Object.assign(options, {
    populate: "sender",
    filter: {sender: {select: "username fullName avatar email internalEmail"}}
  });
  return Request.paginate(filter, options);
}

/**
 * Update
 * @param {Object} filter
 * @return {Promise}
 */
const getRequest = async (filter) => {
  if (!filter) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  if (filter.receiver && await UserRequest.countDocuments({request: filter._id, receiver: filter.receiver}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  let request = await Request.findOne(filter).populate({
    path: "sender",
    model: "User",
    select: "username fullName avatar email"
  }).lean();
  if (!request || request.deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found")
  }
  request = {
    ...request,
    sentTo: (await UserRequest.find({request: request._id})
      .populate({path: "receiver", model: "User", select: "username fullName email password"})
      .lean())
      .map(req => req.receiver)
  }
  return request;
}

/**
 * Edit request
 * @param {ObjectId} requestId
 * @param {Object} updateBody
 * @return {Promise<Request>}
 */
const updateRequest = async (requestId, updateBody) => {
  let request = await Request.findOne({_id: requestId}).populate({
    path: "sender",
    model: "User",
    select: "username fullName internalEmail email"
  });
  if (!request || request.deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  Object.assign(request, updateBody);
  await request.save();
  request = await getRequest({_id: requestId});
  return request;
};

/**
 * Approve request
 * @param {ObjectId} requestId
 * @param {ObjectId} userId
 * @param {Object} body
 * @return {Promise<Request>}
 */
const approvalRequest = async (requestId, userId, body) => {
  if (!body.hasOwnProperty('approval')) throw new ApiError(httpStatus.BAD_REQUEST, 'Bad request');
  const request = await Request.findOne({_id: requestId}).populate({
    path: "sender",
    model: "User",
    select: "username fullName internalEmail email"
  });
  const receiverRecord = await UserRequest.findOne({
    receiver: userId,
    request: request._id
  });
  if (!request || request.deleted || !receiverRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  await RequestRecord.create({
    request: request._id,
    receiver: userId,
    action: body.approval,
    date: Date.now()
  })
  Object.assign(receiverRecord, {approval: body.approval});
  await receiverRecord.save();
  /*const receiverRecords = await UserRequest.find({
    request: request._id
  });*/
  Object.assign(request, {state: body.approval});
  /*request.state = 'in-progress';
  if (receiverRecords.some(r => r.approval === 'rejected')) {
    request.state = 'rejected';
  } else if (receiverRecords.every(r => r.approval === 'approved')) {
    request.state = 'resolved';
  }*/
  await request.save();
  return request;
};

/**
 * Delete request
 * @param {ObjectId} requestId
 * @return {Promise<Request>}
 */
const deleteRequest = async (requestId) => {
  const request = await Request.findOne({_id: requestId});
  if (!request || request.deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  //await request.deleteOne();
  Object.assign(request, {deleted: true});
  await request.save();
  return request;
}

/**
 * Restore Request
 * @param {Object} requests
 * @return {Promise}
 */
const restoreRequests = async (requests) => {
  let execute = requests.map(r => {
    return {
      updateOne: {
        filter: {
          _id: r,
        },
        update: {
          deleted: false,
        }
      }
    }
  })
  return Request.bulkWrite(execute);
}

module.exports = {
  sendRequest,
  // getRequests,
  getSentRequests,
  getIncomingRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  getDeletedRequests,
  restoreRequests,
  approvalRequest,
  getRecords,
}
