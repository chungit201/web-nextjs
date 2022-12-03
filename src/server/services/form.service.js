const httpStatus = require('http-status')
const ApiError = require("../utils/api-error");
const {Form, Question, Answer} = require('../models');

const updateFormAndAnswers = async (form, body) => {
  if (body.answers) {
    let answers = [...body.answers];
    delete body.answers;
    let update = answers.map(entry => {
      return {
        updateOne: {
          filter: {
            form: form._id,
            question: entry.questionId,
          },
          update: {
            answer: entry.answer,
          }
        }
      }
    });
    await Answer.bulkWrite(update);
  }
  Object.assign(form, body);
  await form.save();
  return form;
};

/**
 * Create new Form
 * @param {Object} formBody - Form's object body
 * @return {Promise}
 */
const createForm = async (formBody) => {
  let form = await Form.create(formBody);
  return updateFormAndAnswers(form, formBody);
}

/**
 * Query forms
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryForms = async (filter, options) => {
  Object.assign(options, {populate: 'user,sampleForm', filter: {user: {select: "username fullName avatar email internalEmail"}}});
  return Form.paginate(filter, options);
}

/**
 * Get form by id
 * @param {ObjectId} id - Id for finding
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @returns {Object}
 */
const getFormById = async (id, isManager, userId) => {
  let form = await Form.findById(id).populate('user,sampleForm').lean();
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  if (!isManager && form.user._id !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  let answers = await Answer.find({form: form._id}).populate('question').lean();
  form.anwsers = answers;
  return form;
}


/**
 * Update form
 * @param {ObjectId} formId
 * @param {Object} updateBody
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @return {Promise<Form>}
 */
const updateForm = async (formId, updateBody, isManager, userId) => {
  let form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  if (!isManager && form.user._id !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  return updateFormAndAnswers(form, updateBody);
};

/**
 * Delete form
 * @param {ObjectId} formId
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @return {Promise<Form>}
 */
const deleteForm = async (formId, isManager, userId) => {
  const form = await Form.findOne({_id: formId});
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  if (!isManager && form.user._id !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  await form.deleteOne();
  return form;
}

module.exports = {
  createForm,
  queryForms,
  getFormById,
  updateForm,
  deleteForm,
}
