const httpStatus = require('http-status')
const {Event, UserEvent} = require('../models');
const ApiError = require("../utils/api-error");
const moment = require("moment");

/**
 * Create new Event
 * @param {Object} eventBody - Event's object body
 * @return {Object}
 */
const createEvent = async (eventBody) => {
  let members = eventBody.members ? [...eventBody.members] : null;
  delete eventBody.members;
  let event = await Event.create(eventBody);
  let execute = members.map(e => {
    return {
      insertOne: {
        document: {
          user: e,
          event: event._id,
        }
      }
    }
  })
  await UserEvent.bulkWrite(execute);
  return event;
}

/**
 * Get members by event
 * @param {string} eventId
 * @param {Object} filter
 * @param {Object} options
 * @param {string} options.sortBy
 * @param {number} options.limit
 * @param {number} options.page
 * @returns {Promise<QueryResult>}
 */
const getMembers = async (eventId, filter, options) => {
  Object.assign(options, {populate: 'user', filter: {user: {select: "username fullName avatar email internalEmail"}}}); UserEvent.paginate({event: eventId}, options);
}

/**
 * Query events
 * @param {Object} filter - Filter for find
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise}
 */
const queryEvents = async (filter, options, isManager, userId) => {
  if (isManager) {
    Object.assign(options, {populate: 'creator', filter: {creator: {select: "username fullName avatar email internalEmail"}}});
    return Event.paginate(filter, options);
  } else {
    let relations = (await UserEvent.find({user: userId}).lean()).map(e => e.event.toString());
    let owners = (await Event.find({creator: userId}).lean()).map(e => e._id.toString());
    let temp = new Set(relations.concat(owners));
    let events = Array.from(temp);
    Object.assign(filter, {"_id": {"$in": events}});
    Object.assign(options, {populate: 'creator', filter: {creator: {select: "username fullName avatar email internalEmail"}}});
    options.limit = await Event.countDocuments(filter);
    let result = await Event.paginate(filter, options);
    const {results: eventArr} = result;

    let tempList = [];
    for (let i = 0; i < eventArr.length; i++) {
      if ((eventArr[i + 1] && (moment(parseInt(eventArr[i].startDate)).format("DD-MM-YYYY") !== moment(parseInt(eventArr[i + 1].startDate)).format("DD-MM-YYYY"))) || i === (eventArr.length - 1)) {
        let day = moment(parseInt(eventArr[i].startDate)).format("YYYY-MM-DD");
        let events = eventArr.filter(event => moment(parseInt(event.startDate)).format("YYYY-MM-DD") === day);
        tempList.push({day, events});
      }
    }
    result = {...result, results: tempList};
    return result;
  }
}

/**
 * Get event by id
 * @param {Object} filter - Id for finding
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @returns {Object}
 */
const getEventByFilter = async (filter, isManager, userId) => {
  let event = await Event.findOne(filter).populate({
    path: 'creator',
    model: 'User',
    select: 'username email'
  }).lean();
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  let members = await UserEvent.find({event: event._id}).populate({
    path: 'user',
    model: 'User',
    select: 'username email',
  });
  Object.assign(event, {
    members: members.map(m => m.user)
  });
  if (!isManager && !event.members.some(e => e._id.toString() === userId.toString()) && event.creator._id.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return event;
}


/**
 * Update event
 * @param {ObjectId} eventId
 * @param {Object} updateBody
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @return {Promise<Event>}
 */
const updateEvent = async (eventId, updateBody, isManager, userId) => {
  const event = await Event.findOne({_id: eventId});
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  if (!isManager && userId.toString() !== event.creator.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  if (updateBody.members && updateBody.members.length > 0) {
    let members = updateBody.members ? [...updateBody.members] : null;
    delete updateBody.members;
    let existedMembers = (await UserEvent.find({event: event._id}).lean()).map(m => m.user);
    let removeMember = existedMembers.filter(m => !members.includes(m));
    await UserEvent.deleteMany({user: {$in: removeMember }});
    let addedMember = members.filter(m => !existedMembers.includes(m._id)).map(m => {
      return {
        insertOne: {
          document: {
            user: m,
            event: event._id,
          }
        }
      }
    });
    await UserEvent.bulkWrite(addedMember);
  }
  Object.assign(event, updateBody);
  await event.save();
  return event;
};

/**
 * Delete event
 * @param {ObjectId} eventId
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @return {Promise<Event>}
 */
const deleteEvent = async (eventId, isManager, userId) => {
  const event = await Event.findOne({_id: eventId});
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }
  if (!isManager && userId.toString() !== event.creator.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await event.deleteOne();
  return event;
}

module.exports = {
  createEvent,
  queryEvents,
  getEventByFilter,
  updateEvent,
  deleteEvent,
  getMembers,
}
