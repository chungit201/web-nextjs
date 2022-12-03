const httpStatus = require('http-status')
const {AttendanceRecord} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new Attendance
 * @param {Object} attendanceBody - Attendance's object body
 * @return {Promise}
 */
const createAttendance = async (attendanceBody) => {
  return AttendanceRecord.create(attendanceBody);
}

/**
 * Query Attendances
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAttendances = async (filter, options) => {
  return AttendanceRecord.paginate(filter, options);
}


/**
 * Get Attendance by filter
 * @param {Object} filter - Id for finding
 * @returns {Object}
 */
const getAttendanceById = async (filter) => {
  let attendance = await AttendanceRecord.findOne(filter).lean();
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attendance not found');
  }
  return attendance;
}


/**
 * Update Attendance
 * @param {ObjectId} attendanceId
 * @param {Object} updateBody
 * @return {Promise<AttendanceRecord>}
 */
const updateAttendance = async (attendanceId, updateBody) => {
  const attendance = await AttendanceRecord.findOne({_id: attendanceId});
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attendance not found');
  }

  Object.assign(attendance, updateBody);
  await attendance.save();
  return attendance;
};

/**
 * Delete Attendance
 * @param {ObjectId} attendanceId
 * @return {Promise<AttendanceRecord>}
 */
const deleteAttendance = async (attendanceId) => {
  const attendance = await AttendanceRecord.findOne({_id: attendanceId});
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Attendance record not found');
  }

  await AttendanceRecord.updateOne({_id: attendanceId}, {deleted: true});
  return attendance;
}


module.exports = {
  createAttendance,
  queryAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
}
