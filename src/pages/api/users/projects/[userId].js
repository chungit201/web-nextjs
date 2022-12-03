import {connectDB, validate} from "server/middlewares";
import {userController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getProjects} from "server/validations/user.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, validate(req, res, getProjects));

  if (req.method === "GET") {
    await userController.getProjects(req, res);
  }
});

export default connectDB(handler);