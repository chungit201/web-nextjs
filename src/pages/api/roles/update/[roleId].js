import {auth, connectDB, validate} from "server/middlewares";
import {roleController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {updateRole} from "server/validations/role.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_ROLE", "UPDATE_ALL_ROLE"));
  await runMiddleware(req, res, validate(req, res, updateRole));

  if (req.method === "POST") {
    await roleController.updateRole(req, res);
  }
});

export default connectDB(handler);
