import {auth, connectDB, validate} from "../../../server/middlewares";
import {roleController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getRoles} from "server/validations/role.validation";

const handler = (async (req, res) => {
  console.log(req);
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_ROLE", "GET_ALL_ROLE"));
  await runMiddleware(req, res, validate(req, res, getRoles));

  if (req.method === "GET") {
    await roleController.getRoles(req, res);
  }
});

export default connectDB(handler);
