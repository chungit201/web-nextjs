const catchAsync = require('../utils/catch-async');
const {uiSettingService} = require('../services');
const pick = require("../utils/pick");

const addUISetting = catchAsync(async (req, res) => {
  const uiSetting = await uiSettingService.createUISetting(req.body, req.user._id);
  res.json({
    message: `Created uiSetting successfully`,
    uiSetting
  });
});

const getUISettings = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['owner']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await uiSettingService.queryUISettings(filter, options);
  res.json(result);
});

const getUISetting = catchAsync(async (req, res) => {
  const result = await uiSettingService.getUISettingByOwner(req.user._id);
  res.json(result);
});

const updateUISetting = catchAsync(async (req, res) => {
  const uiSetting = await uiSettingService.updateUISettingByOwner(req.body, req.user.role.permissions.includes('MANAGE_ALL_UISETTING'), req.user._id);
  res.send({
    message: 'Updated uiSetting successfully',
    uiSetting: uiSetting
  });
});

const deleteUISetting = catchAsync(async (req, res) => {
  const uiSetting = await uiSettingService.deleteUISetting(req.params.uiSettingId, req.user.role.permissions.includes('MANAGE_ALL_UISETTING'), req.user._id);
  res.send({
    message: "Deleted uiSetting successfully",
    uiSetting: uiSetting
  })
});

module.exports = {
  addUISetting,
  getUISetting,
  getUISettings,
  updateUISetting,
  //deleteUISetting,
}
