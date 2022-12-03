import {auth, connectDB, validate} from "../../../../server/middlewares";
import {reportController, } from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getRequests} from "server/validations/request.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, getRequests));

  if (req.method === "GET") {
    await reportController.getSampleReport(req, res);
  }
});

export default connectDB(handler);
