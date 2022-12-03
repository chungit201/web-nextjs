import {auth, connectDB} from "server/middlewares";
import {permissionController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));

  if (req.method === "GET") {
    await permissionController.getPermissions(req, res);
  }
});

export default connectDB(handler);