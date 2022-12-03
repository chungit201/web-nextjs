const catchAsync = require('../utils/catch-async');
const {eventService} = require('../services');
const pick = require("../utils/pick");
const moment = require("moment");

const addEvent = catchAsync(async (req, res) => {
  let body = req.body;
  Object.assign(body, {creator: req.user._id});
  const event = await eventService.createEvent(body);
  res.json({
    message: `Created event successfully`,
    event: event
  });
});

const getEvents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['slug', 'state', 'creator', 'group']);

  if (req.query['start'] || req.query['end']) {
    filter['queryRange'] = {
      field: req.query['range'],
      start: +req.query['start'] ?? null,
      end: +req.query['end'] ?? null,
    }
  }
  const options = pick(req.query, ['limit', 'page']);
  options.sortBy = "startDate";
  let result = await eventService.queryEvents(filter, options, req.user.role.permissions.includes('MANAGE_ALL_EVENT'), req.user._id);

  res.json(result);
});

const getEvent = catchAsync(async (req, res) => {
  const result = await eventService.getEventByFilter(req.query.eventId, req.user.role.permissions.includes('MANAGE_ALL_EVENT'), req.user._id);
  res.json(result);
});

const updateEvent = catchAsync(async (req, res) => {
  const event = await eventService.updateEvent(req.query.eventId, req.body, req.user.role.permissions.includes('MANAGE_ALL_EVENT'), req.user._id);
  res.send({
    message: 'Updated event successfully',
    event: event
  });
});

const deleteEvent = catchAsync(async (req, res) => {
  const event = await eventService.deleteEvent(req.query.eventId, req.user.role.permissions.includes('MANAGE_ALL_EVENT'), req.user._id);
  res.send({
    message: "Deleted event successfully",
    event: event
  })
});

const getMembers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['username', 'role', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await eventService.getMembers(req.query.eventId, filter, options);
  res.json(result);
});

module.exports = {
  addEvent,
  getEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getMembers,
}
