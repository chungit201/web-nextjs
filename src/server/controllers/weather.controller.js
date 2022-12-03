const axios = require("axios");

module.exports.getForecast = (req, res) => {
  axios('http://api.weatherapi.com/v1/forecast.json', {
    method: 'GET',
    params: {
      key: '851d223c6d1b4287b5035440211112',
      q: req.body.city,
      days: req.body.days,
      aqi: 'yes',
      alerts: 'yes',
    }}
  ).then(response => {
    res.json(response.data);
  }).catch(err => {
    res.json(err);
  })
};
