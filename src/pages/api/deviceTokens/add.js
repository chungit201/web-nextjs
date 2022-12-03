import {auth, connectDB, validate} from "server/middlewares";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {deviceTokensValidation} from "../../../server/validations";
import {deviceTokenController} from "../../../server/controllers";


const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, deviceTokensValidation));

  if (req.method === "POST") {
    await deviceTokenController.addDeviceToken(req, res);
  }
});

export default connectDB(handler);