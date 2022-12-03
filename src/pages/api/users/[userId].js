import {auth, connectDB, validate} from "server/middlewares";
import {userController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getUser} from "server/validations/user.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_USER", "GET_ALL_USER"));
  await runMiddleware(req, res, validate(req, res, getUser));

  if (req.method === "GET") {
    await userController.getUser(req, res);
  }
});

export default connectDB(handler);