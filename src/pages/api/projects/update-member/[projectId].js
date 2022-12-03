import {auth, connectDB, validate} from "server/middlewares";
import {projectController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {updateMember} from "server/validations/project.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, updateMember));


  if (req.method === "POST") {
    await projectController.updateMember(req, res);
  }
});

export default connectDB(handler);
