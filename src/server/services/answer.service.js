const httpStatus = require('http-status')
const {Answer, User, Question} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new Question
 * @param {Object} answerBody - Answer's object body
 * @return {Promise}
 */
const createAnswer = async (answerBody) => {
  return Answer.create(answerBody);
}

/**
 * Query answers
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAnswers = async (filter, options) => {
  Object.assign(options, {populate: 'question,user', filter: {user: {select: "username fullName avatar email internalEmail"}}});
  return Answer.paginate(filter, options);
}

/**
 * Get answer by id
 * @param {ObjectId} id - Id for finding
 * @returns {Object}
 */
const getAnswerById = async (id) => {
  let answer = await Answer.findById(id).populate('question,user');
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }
  return answer;
}

/**
 * Update answer
 * @param {ObjectId} answerId
 * @param {Object} updateBody
 * @return {Object}
 */
const updateAnswer = async (answerId, updateBody) => {
  let answer = await Answer.findById(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }
  Object.assign(answer, updateBody);
  await answer.save();
  return answer;
};

/**
 * Delete answer
 * @param {ObjectId} answerId
 * @return {Object}
 */
const deleteAnswer = async (answerId) => {
  let answer = await Answer.findById(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }
  await answer.deleteOne();
  return answer;
}

module.exports = {
  createAnswer,
  queryAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
}
