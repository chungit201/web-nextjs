import {auth, connectDB, validate} from "server/middlewares";
import {roleController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getRole} from "server/validations/role.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_ROLE", "GET_ALL_ROLE"));
  await runMiddleware(req, res, validate(req, res, getRole));

  if (req.method === "GET") {
    await roleController.getRole(req, res);
  }
});

export default connectDB(handler)