const httpStatus = require('http-status')
const {Answer, Form, Question} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new Question
 * @param {Object} questionBody - Question's object body
 * @return {Promise}
 */
const createQuestion = async (questionBody) => {
  return Question.create(questionBody);
}

/**
 * Query questions
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuestions = async (filter, options) => {
  Object.assign(options, {populate: 'form'});
  return Question.paginate(filter, options);
}

/**
 * Get question by id
 * @param {ObjectId} id - Id for finding
 * @returns {Object}
 */
const getQuestionById = async (id) => {
  let question = await Question.findById(id).populate('form').lean();
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  let answers = await Answer.find({question: question._id}).populate({
    path: 'creator',
    model: 'User',
    select: 'username fullName avatar createdAt'
  }).lean();
  question.awnsers = answers;
  return question;
}


/**
 * Update question
 * @param {ObjectId} questionId
 * @param {Object} updateBody
 * @return {Object}
 */
const updateQuestion = async (questionId, updateBody) => {
  let question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  Object.assign(question, updateBody);
  await question.save();
  return question;
};

/**
 * Delete question
 * @param {ObjectId} questionId
 * @return {Object}
 */
const deleteQuestion = async (questionId) => {
  let question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  await question.deleteOne();
  return question;
}

module.exports = {
  createQuestion,
  queryQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
}
