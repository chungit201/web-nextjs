import {connectDB, errorHandler} from "server/middlewares";
import {authController} from "server/controllers";
import middlewares from "server";

const handler = (async (req, res) => {
  await middlewares(req, res);

  if (req.method === "POST") {
    try {
      await authController.refreshTokens(req, res);
    } catch (err) {
      // console.error(err);
      errorHandler(err, req, res)
    }
  }
});

export default connectDB(handler);
