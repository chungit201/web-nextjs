import {connectDB} from "server/middlewares";
import {authController} from "server/controllers";
import middlewares from "server";

const handler = (async (req, res) => {
  await middlewares(req, res);
  if (req.method === "POST") {
    // await authController.register(req, res);
  }
});

export default connectDB(handler);