const catchAsync = require("../utils/catch-async");
const {attendanceRecordService} = require("../services");
const pick = require("../utils/pick");
const ApiError = require("../utils/api-error");
const httpStatus = require("http-status");
const atdConfig = require("../config/attendance.config");

const addAttendance = catchAsync(async (req, res) => {
  const {card_id: cardId, secret} = req.query;
  if (secret !== atdConfig.secret) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Secret is invalid");
  }
  const attendanceRecord = await attendanceRecordService.createAttendance({cardId/*, time: new Date().getTime()*/});
  res.json({
    message: "Created attendance record successfully",
    attendanceRecord
  });
});

const getAttendances = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['cardId', 'time']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const attendanceRecords = await attendanceRecordService.queryAttendances(filter, options);
  res.json(attendanceRecords);
});

const getAttendance = catchAsync(async (req, res) => {
  const attendanceRecord = await attendanceRecordService.getAttendanceById(req.params.attendanceId);
  res.json(attendanceRecord);
});

const updateAttendance = catchAsync(async (req, res) => {
  const result = await attendanceRecordService.updateAttendance(req.params.attendanceId, req.body);
  res.json({
    message: "Updated Attendance successfully",
    attendanceRecord: result.attendance
  });
});

const deleteAttendance = catchAsync(async (req, res) => {
  const attendance = await attendanceRecordService.deleteAttendance(req.params.attendanceId);
  res.json({
    message: "Deleted Attendance successfully",
    attendance
  });
});

module.exports = {
  addAttendance,
  getAttendances,
  getAttendance,
  updateAttendance,
  deleteAttendance,
}
