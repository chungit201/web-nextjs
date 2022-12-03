import {auth, connectDB, validate} from "server/middlewares";
import {notificationController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getNotifications} from "../../../server/validations/notification.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res,getNotifications));
  if (req.method === "GET") {
    await notificationController.getNotifications(req, res);
  }
});

export default connectDB(handler);