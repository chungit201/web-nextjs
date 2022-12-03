const catchAsync = require('../utils/catch-async');
const {noteService} = require('../services');
const pick = require("../utils/pick");

const addNote = catchAsync(async (req, res) => {
  let body = req.body;
  Object.assign(body, {creator: req.user._id});
  const note = await noteService.createNote(body);
  res.json({
    message: `Created note successfully`,
    note: note
  });
});

const getNotes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['slug', 'creator', 'date']);
  if (req.query['start'] || req.query['end']) {
    filter['queryRange'] = {
      field: "searchDate",
      start: +req.query['start'] ?? null,
      end: +req.query['end'] ?? null,
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (!req.user.role.permissions.includes('MANAGE_ALL_NOTE')) filter["$or"] = [{privacy: "public"}, {$and: [{creator: req.user.id}, {privacy: 'onlyme'}]}];
  const results = await noteService.queryNotes(filter, options);
  res.json({results});
});

const getNote = catchAsync(async (req, res) => {
  let filter = (req.user.role.permissions.includes('MANAGE_ALL_NOTE')) ? {_id: req.query.noteId} : {
    $or: [{
      $and: [{_id: req.query.noteId}, {privacy: "public"}]
    }, {
      $and: [{creator: req.user.id}, {_id: req.query.noteId}]
    }]
  }
  const result = await noteService.getNote(filter);
  res.json(result);
});

const updateNote = catchAsync(async (req, res) => {
  const note = await noteService.updateNote(req.query.noteId, req.body);
  res.send({
    message: `Updated note successfully`,
    note: note
  });
});

const deleteNote = catchAsync(async (req, res) => {
  const note = await noteService.deleteNote(req.query.noteId);
  res.send({
    message: "Deleted note successfully",
    note: note
  })
});

module.exports = {
  addNote,
  getNote,
  getNotes,
  updateNote,
  deleteNote
}
