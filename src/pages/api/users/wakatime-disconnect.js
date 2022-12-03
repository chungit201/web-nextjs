import {auth, connectDB} from "server/middlewares";
import {userController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));

  if (req.method === "POST") {
    await userController.disconnectWakatime(req, res);
  }
});

export default connectDB(handler);