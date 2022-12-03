import {auth, connectDB, errorHandler} from "server/middlewares";
import {userController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));

  if (req.method === "GET") {
    try {
      await userController.getSelfInfo(req, res);
    } catch (err) {
      errorHandler(err, req, res);
    }
  }
});

export default connectDB(handler);
