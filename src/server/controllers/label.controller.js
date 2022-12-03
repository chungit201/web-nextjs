const catchAsync = require('../utils/catch-async');
const {labelService} = require('../services');
const pick = require("../utils/pick");

const addLabel = catchAsync(async (req, res) => {
  const label = await labelService.createLabel(req.body);
  res.json({
    message: `Created label successfully`,
    label
  });
});

const getLabels = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['slug', 'state', 'project']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await labelService.queryLabels(filter, options);
  res.json(result);
});

const getLabel = catchAsync(async (req, res) => {
  const result = await labelService.getLabelById(req.params.labelId);
  res.json(result);
});

const updateLabel = catchAsync(async (req, res) => {
  const label = await labelService.updateLabel(req.params.labelId, req.body);

  res.send({
    message: 'Updated label successfully',
    label: label
  });
});

const deleteLabel = catchAsync(async (req, res) => {
  const label = await labelService.deleteLabel(req.params.labelId);
  res.send({
    message: "Deleted label successfully",
    label: label
  })
});

module.exports = {
  addLabel,
  getLabel,
  getLabels,
  updateLabel,
  deleteLabel,
}
