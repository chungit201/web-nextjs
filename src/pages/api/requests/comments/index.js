import {auth, connectDB} from "server/middlewares";
import {requestController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));

  if (req.method === "GET") {
    await requestController.getComment(req, res);
  }
});

export default connectDB(handler);
