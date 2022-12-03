import { auth, connectDB, validate } from "server/middlewares";
import { departmentController } from "server/controllers";
import middlewares from "server";
import { runMiddleware } from "server/utils/middleware-handler";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res));

  if (req.method === "POST") {
    await departmentController.addDepartment(req, res);
  }
});

export default connectDB(handler);