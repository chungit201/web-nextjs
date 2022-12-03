import {auth, connectDB, validate} from "server/middlewares";
import {userController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {updateUser} from "server/validations/user.validation";

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_USER", "UPDATE_ALL_USER"));
  await runMiddleware(req, res, validate(req, res, updateUser));

  if (req.method === "POST") {
    await userController.updateUser(req, res);
  }
});

export default connectDB(handler);
