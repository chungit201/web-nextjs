import {auth, connectDB, validate} from "server/middlewares";
import {requestController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {deleteRequest} from "server/validations/request.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_REQUEST", "DELETE_ALL_REQUEST"));
  await runMiddleware(req, res, validate(req, res, deleteRequest));

  if (req.method === "POST") {
    await requestController.deleteRequest(req, res);
  }
});

export default connectDB(handler);
