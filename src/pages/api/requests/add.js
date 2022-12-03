import {auth, connectDB, validate} from "server/middlewares";
import { requestController } from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {sendRequest} from "server/validations/request.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, sendRequest));


  if (req.method === "POST") {
    await requestController.sendRequest(req, res);
  }
});

export default connectDB(handler);