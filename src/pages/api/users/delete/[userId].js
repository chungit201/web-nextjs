import {auth, connectDB, errorHandler, validate} from "server/middlewares";
import {userController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {deleteUser} from "server/validations/user.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_USER", "DELETE_ALL_USER"));
  await runMiddleware(req, res, validate(req, res, deleteUser));

  if (req.method === "POST") {
    try {
      await userController.deleteUser(req, res);
    } catch (e) {
      errorHandler(e, req, res);
    }
  }
});

export default connectDB(handler);
