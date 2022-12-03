const catchAsync = require("../utils/catch-async");
const pick = require("../utils/pick");
const {deviceTokenService} = require("../services");
const addDeviceToken = catchAsync(async (req, res) => {
  const deviceToken = await deviceTokenService.createDeviceToken(req.body);
  res.json({
    message: "Create deviceToken success fully",
    deviceToken: deviceToken
  });
})

const getDeviceTokens = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const deviceTokens = await deviceTokenService.queryDeviceToken(filter, options);
  res.json({
    deviceTokens
  });
});

const getDeviceToken = catchAsync(async (req, res) => {
  const deviceToken = await deviceTokenService.deviceTokenById(req.params.deviceTokenId);
  res.json({
    deviceToken
  })
});

const removeDeviceToken = catchAsync(async (req, res) => {
  const deviceToken = await deviceTokenService.deviceTokenById(req.params.deviceTokenId);
  res.json({
    message: "Delete device token success fully",
    deviceToken: deviceToken
  })
});

module.exports = {
  getDeviceToken,
  getDeviceTokens,
  removeDeviceToken,
  addDeviceToken
}

