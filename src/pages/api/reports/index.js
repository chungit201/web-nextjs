import {auth, connectDB, validate} from "server/middlewares";
import { reportController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getReports} from "server/validations/report.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, ));
  await runMiddleware(req, res, validate(req, res, getReports));
  if (req.method === "GET") {
    await reportController.getReports(req, res);
  }
});

export default connectDB(handler);