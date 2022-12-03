import {auth, connectDB, validate} from "server/middlewares";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import axios from "axios";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  if (req.method === "POST") {
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
    });
  }
});

export default connectDB(handler);
