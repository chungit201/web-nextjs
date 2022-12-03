const httpStatus = require('http-status')
const {SampleForm, Question} = require('../models');
const ApiError = require("../utils/api-error");

const updateSampleFormAndQuestions = async (form, body) => {
  if (body.questions) {
    let questions = [...body.questions];
    delete body.questions;
    let deleteQs = questions.filter(q => q.delete).map(q => q._id);
    await Question.deleteMany({_id: {$in: deleteQs }});
    let updateQs = questions.filter(q => !q.delete && q._id).map(q => {
      return {
        updateOne: {
          filter: {_id: q._id},
          update: q.body
        }
      }
    });
    let createQs = questions.filter(q => !q.delete && !q._id).map(q => {
      return {
        insertOne: {
          document: q.body,
        }
      }
    });
    let execute = updateQs.concat(createQs);
    await Question.bulkWrite(execute);
  }
  Object.assign(form, body);
  await form.save();
  return form;
};

/**
 * Create new Sample Form
 * @param {Object} formBody - Form's object body
 * @return {Promise<SampleForm>}
 */
const createSampleForm = async (formBody) => {
  let form = await SampleForm.create(formBody);
  return updateSampleFormAndQuestions(form, formBody);
}

/**
 * Query sample forms
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySampleForms = async (filter, options) => {
  Object.assign(options, {populate: 'manager', filter: {manager: {select: "username fullName avatar email internalEmail"}}});
  return SampleForm.paginate(filter, options);
}

/**
 * Get sample form by slug
 * @param {string} slug - Slug for finding
 * @returns {Object}
 */
const getSampleFormBySlug = async (slug) => {
  let form = await SampleForm.findOne({slug: slug}).lean();
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sample Form not found');
  }
  let questions = await Question.find({sampleForm: form._id});
  form.questions = questions;
  return form;
}

/**
 * Get sample form by id
 * @param {ObjectId} id - Id for finding
 * @returns {Object}
 */
const getSampleFormById = async (id) => {
  let form = await SampleForm.findById(id).populate('manager').lean();
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sample Form not found');
  }
  let questions = await Question.find({sampleForm: form._id});
  form.questions = questions;
  return form;
}

/**
 * Update sample form
 * @param {ObjectId} formId
 * @param {Object} updateBody
 * @return {Promise<SampleForm>}
 */
const updateSampleForm = async (formId, updateBody) => {
  let form = await SampleForm.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sample Form not found');
  }
  return updateSampleFormAndQuestions(form, updateBody);
};

/**
 * Delete sample form
 * @param {ObjectId} formId
 * @return {Promise<SampleForm>}
 */
const deleteSampleForm = async (formId) => {
  const form = await SampleForm.findOne({_id: formId});
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sample Form not found');
  }
  await form.deleteOne();
  return form;
}

module.exports = {
  createSampleForm,
  querySampleForms,
  getSampleFormById,
  getSampleFormBySlug,
  updateSampleForm,
  deleteSampleForm,
}
