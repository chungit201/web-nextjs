const catchAsync = require('../utils/catch-async');
const {formService} = require('../services');
const pick = require("../utils/pick");

const submitForm = catchAsync(async (req, res) => {
  let body = req.body;
  Object.assign(body, {user: req.user._id});
  const form = await formService.createForm(body);
  res.json({
    message: `Submitted form successfully`,
    form: form
  });
});

const getForms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'sampleForm']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (!req.user.role.permissions.includes('MANAGE_ALL_FORM')) Object.assign(filter,
    {
      user: req.user._id
    })
  const result = await formService.queryForms(filter, options);
  res.json(result);
});

const getForm = catchAsync(async (req, res) => {
  const result = await formService.getFormById(req.params.formId, req.user.role.permissions.includes('MANAGE_ALL_FORM'), req.user._id);
  res.json(result);
});

const updateForm = catchAsync(async (req, res) => {
  const form = await formService.updateForm(req.params.formId, req.body, req.user.role.permissions.includes('MANAGE_ALL_FORM'), req.user._id);
  res.send({
    message: 'Updated form successfully',
    form: form
  });
});

const deleteForm = catchAsync(async (req, res) => {
  const form = await formService.deleteForm(req.params.formId, req.user.role.permissions.includes('MANAGE_ALL_FORM'), req.user._id);
  res.send({
    message: "Deleted form successfully",
    form: form
  })
});

module.exports = {
  submitForm,
  getForm,
  getForms,
  updateForm,
  deleteForm,
}
