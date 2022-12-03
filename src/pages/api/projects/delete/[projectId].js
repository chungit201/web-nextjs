import {auth, connectDB, validate} from "server/middlewares";
import {projectController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {projectValidation} from "server/validations";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res,"MANAGE_ALL_PROJECT"));
  await runMiddleware(req, res, validate(req, res, projectValidation));

  if (req.method === "POST") {
    await projectController.deleteProject(req, res);
  }
});

export default connectDB(handler);