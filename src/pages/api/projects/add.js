import {auth, connectDB, validate} from "server/middlewares";
import {projectController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  // await runMiddleware(req, res, validate(req, res, addProject));


  if (req.method === "POST") {
    await projectController.addProject(req, res);
  }
});

export default connectDB(handler);