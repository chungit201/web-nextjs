const httpStatus = require('http-status')
const {Report, Project, Task, UserTask, Note} = require('../models');
const ApiError = require("../utils/api-error");
const boardService = require("./board.service");

/**
 * Create new Report
 * @param {Object} reportBody - Report's object body
 * @return {Promise}
 */
const createReport = async (reportBody) => {
  reportBody.date = Date.now();
  // if (reportBody.isSample === true && ) {
  return Report.create(reportBody);
  // }
}

/**
 * Get Reports
 * @param {Object} filter - filter for paginate
 * @param {Object} options - options for paginate
 * @returns {Promise<QueryResult>}
 */
const getReports = async (filter, options) => {
  filter.isSample = false;
  Object.assign(filter, {deleted: {$ne: true}});
  options.populate = "creator";
  return Report.paginate(filter, options);
}

const getReport = async (reportId, filter = {}) => {
  let report = await Report.findOne({_id: reportId, ...filter}).populate({
    path: 'creator',
    model: 'User',
    select: "username fullName avatar createdAt"
  });
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }

  return report;
}

/**
 * Get deleted Reports
 * @param {Object} filter - filter for paginate
 * @param {Object} options - options for paginate
 * @returns {Promise<QueryResult>}
 */
const getDeletedReports = async (filter, options) => {
  filter.isSample = false;
  Object.assign(filter, {deleted: true});
  options.populate = "creator";
  return Report.paginate(filter, options);
}

/**
 * Get Sample Report
 * @param {Object} filter
 * @returns {Promise<QueryResult>}
 */
const getReportSample = async (filter) => {
  Object.assign(filter, {deleted: {$ne: true}});
  return Report.findOne(filter).populate({path: "creator", model: "User", select: "username fullName avatar email "});
}

/**
 * Update Report
 * @param {Object} filter
 * @param {Object} updateBody
 * @return {Promise}
 */
const updateReport = async (filter, updateBody) => {
  Object.assign(filter, {deleted: {$ne: true}});
  const report = await Report.findOne({filter});
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  Object.assign(report, updateBody);
  await report.save();
  return report;
};
/**
 * Delete Report
 * @param {Object} filter
 * @return {Promise<Report>}
 */
const deleteReport = async (filter) => {
  const report = await Report.findOne(filter);
  Object.assign(filter, {deleted: {$ne: true}});
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }
  //await report.deleteOne();
  Object.assign(report, {deleted: true});
  await report.save();
  return report;
}

/**
 * Restore Report
 * @param {Object} reports
 * @return {Promise}
 */
const restoreReports = async (reports) => {
  let execute = reports.map(r => {
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
  return Report.bulkWrite(execute);
}

module.exports = {
  getReport,
  createReport,
  getReports,
  getReportSample,
  updateReport,
  deleteReport,
  getDeletedReports,
  restoreReports,
}
