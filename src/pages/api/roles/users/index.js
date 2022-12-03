import {auth, connectDB, validate} from "../../../../server/middlewares";
import {roleController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getUsersByPermission} from "server/validations/role.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, getUsersByPermission));

  if (req.method === "GET") {
    await roleController.getUsers(req, res);
  }
});

export default connectDB(handler);
