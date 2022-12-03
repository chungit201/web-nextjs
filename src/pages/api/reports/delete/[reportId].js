import {auth, connectDB, validate} from "server/middlewares";
import {reportController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {deleteReport} from "server/validations/report.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res, "GET_ALL_REPORT"));
  await runMiddleware(req, res, validate(req, res, deleteReport));

  if (req.method === "POST") {
    await reportController.deleteReport(req, res);
  }
});

export default connectDB(handler);