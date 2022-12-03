const httpStatus = require('http-status')
const {Note} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new Note
 * @param {Object} noteBody - Note's object body
 * @return {Promise}
 */
const createNote = async (noteBody) => {
  return Note.create(noteBody);
}

/**
 * Query notes
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNotes = async (filter, options) => {
  Object.assign(options, {populate: 'creator', filter: {creator: {select: "username fullName avatar email internalEmail"}}});
  return Note.paginate(filter, options);
}

/**
 * Get note by id
 * @param {Object} filter - Filter for finding
 * @returns {Object}
 */
const getNote = async (filter) => {
  let note = await Note.findOne(filter).populate({
    path: 'creator',
    model: 'User',
    select: "username fullName avatar createdAt"
  });
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }

  return note;
}


/**
 * Update note
 * @param {ObjectId} noteId
 * @param {Object} updateBody
 * @return {Promise<Note>}
 */
const updateNote = async (noteId, updateBody) => {
  const note = await Note.findOne({_id: noteId});
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }

  if (updateBody.date && (new Date(updateBody.date)).getTime() < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date');
  }
  Object.assign(note, updateBody);
  await note.save();
  return note;
};

/**
 * Delete note
 * @param {ObjectId} noteId
 * @return {Promise<Note>}
 */
const deleteNote = async (noteId) => {
  const note = await Note.findOne({_id: noteId});
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }

  await note.deleteOne();
  return note;
}

module.exports = {
  createNote,
  queryNotes,
  getNote,
  updateNote,
  deleteNote,
}
