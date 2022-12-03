import {auth, connectDB, validate} from "server/middlewares";
import {requestController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {updateRequest} from "server/validations/request.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "MANAGE_ALL_REQUEST", "UPDATE_ALL_REQUEST"));
  await runMiddleware(req, res, validate(req, res, updateRequest));

  if (req.method === "POST") {
    await requestController.updateRequest(req, res);
  }
});

export default connectDB(handler);
