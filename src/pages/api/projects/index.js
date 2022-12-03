import {auth, connectDB, validate} from "server/middlewares";
import { projectController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getProjects} from "../../../server/validations/project.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_PROJECT", "GET_ALL_PROJECT"));
  await runMiddleware(req, res, validate(req, res, getProjects));
  if (req.method === "GET") {
    await projectController.getProjects(req, res);
  }
});

export default connectDB(handler);