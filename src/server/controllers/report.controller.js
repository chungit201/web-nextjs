const catchAsync = require('../utils/catch-async');
const {reportService} = require('../services');
const pick = require("../utils/pick");

const createSampleReport = catchAsync(async (req, res) => {
  req.body.isSample = true;
  req.body.creator = req.user._id;

  const report = await reportService.createReport(req.body);
  res.json({
    message: "Created sample report successfully",
    report
  });
});


const submitReport = catchAsync(async (req, res) => {
  req.body.creator = req.user._id;
  const report = await reportService.createReport(req.body);
  res.json({
    message: "Submit report successfully",
    report
  });
});

const getSampleReport = catchAsync(async (req, res) => {
  const report = await reportService.getReport({isSample: true});
  res.json({
    report
  });
});

const getReport = catchAsync(async (req, res) => {
  const hasAuth = req.user.role.permissions.includes("MANAGE_ALL_REPORT" || "GET_ALL_REPORT");
  const filter = (hasAuth) ? {} : {creator: req.user._id};
  const report = await reportService.getReport({_id: req.query.reportId}, filter);
  res.json({
    report
  });
});

const getReports = catchAsync(async (req, res) => {
  const hasAuth = req.user.role.permissions.includes("MANAGE_ALL_REPORT" || "GET_ALL_REPORT");
  const filter = pick(req.query, ['creator', 'sample', 'createdAt']);
  Object.assign(filter, (hasAuth) ? {} : {creator: req.user._id});
  if (req.query['start'] || req.query['end']) {
    filter['queryRange'] = {
      field: 'date',
      start: +req.query['start'] ?? null,
      end: +req.query['end'] ?? null,
    }
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const results = await reportService.getReports(filter, options);
  res.json({
    ...results
  });
});

const getDeletedReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['creator', 'sample', 'createdAt']);
  if (req.query['start'] || req.query['end']) {
    filter['queryRange'] = {
      field: 'date',
      start: +req.query['start'] ?? null,
      end: +req.query['end'] ?? null,
    }
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const results = await reportService.getDeletedReports(filter, options);
  res.json({
    ...results
  });
});

const updateSampleReport = catchAsync(async (req, res) => {
  const report = await reportService.updateReport({isSample: true}, req.body);
  res.send({
    message: `Updated sample report successfully`,
    report
  });
});

const updateReport = catchAsync(async (req, res) => {
  const report = await reportService.updateReport({_id: req.query.reportId}, req.body);
  res.send({
    message: `Updated report successfully`,
    report
  });
});

const deleteSampleReport = catchAsync(async (req, res) => {
  const report = await reportService.deleteReport({isSample: true});
  res.send({
    message: "Deleted report successfully",
    report
  })
});

const deleteReport = catchAsync(async (req, res) => {
  const report = await reportService.deleteReport({_id: req.query.reportId, isSample: false});
  res.send({
    message: "Deleted report successfully",
    report
  })
});

const restoreReports = catchAsync(async (req, res) => {
  let reports = !Array.isArray(req.body.reports) ? [req.body.reports] : req.body.reports;
  const result = await reportService.restoreReports(reports);
  res.send({
    message: "Restore reports successfully",
    result: result
  })
});

module.exports = {
  createSampleReport,
  getSampleReport,
  deleteSampleReport,
  updateSampleReport,
  submitReport,
  getReport,
  getReports,
  getDeletedReports,
  updateReport,
  deleteReport,
  restoreReports
}
