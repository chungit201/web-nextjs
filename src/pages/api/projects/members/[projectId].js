import {auth, connectDB, validate} from "server/middlewares";
import {projectController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getMembers} from "server/validations/project.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, getMembers));


  if (req.method === "GET") {
    await projectController.getMembers(req, res);
  }
});

export default connectDB(handler);
