import {auth, connectDB, validate} from "server/middlewares";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {pushNotificationController} from "../../../server/controllers";


const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res));

  if (req.method === "POST") {
    await pushNotificationController.sendToRole(req, res);
  }
});

export default connectDB(handler);