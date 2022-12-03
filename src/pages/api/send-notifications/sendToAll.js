import {auth, connectDB, validate} from "server/middlewares";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {pushNotificationValidation} from "../../../server/validations";
import {pushNotificationController} from "../../../server/controllers";


const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, pushNotificationValidation));

  if (req.method === "POST") {
    await pushNotificationController.sendAll(req, res);
  }
});

export default connectDB(handler);