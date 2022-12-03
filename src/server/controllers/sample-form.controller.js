const catchAsync = require('../utils/catch-async');
const {sampleFormService} = require('../services');
const pick = require("../utils/pick");

const addSampleForm = catchAsync(async (req, res) => {
  const form = await sampleFormService.createSampleForm(req.body);
  res.json({
    message: `Created sample form successfully`,
    form: form
  });
});

const getSampleForms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['slug', 'manager', 'repeat']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await sampleFormService.querySampleForms(filter, options);
  res.json(result);
});

const getSampleForm = catchAsync(async (req, res) => {
  const result = await sampleFormService.getSampleFormById(req.params.sampleFormId);
  res.json(result);
});

const updateSampleForm = catchAsync(async (req, res) => {
  const form = await sampleFormService.updateSampleForm(req.params.sampleFormId, req.body);
  res.send({
    message: 'Updated sample form successfully',
    form: form
  });
});

const deleteSampleForm = catchAsync(async (req, res) => {
  const form = await sampleFormService.deleteSampleForm(req.params.sampleFormId);
  res.send({
    message: "Deleted sample form successfully",
    form: form
  })
});

module.exports = {
  addSampleForm,
  getSampleForm,
  getSampleForms,
  updateSampleForm,
  deleteSampleForm,
}
