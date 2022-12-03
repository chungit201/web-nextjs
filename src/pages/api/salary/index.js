import {auth, connectDB, validate} from "../../../server/middlewares";
import {salaryController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res ,"MANAGE_ALL_SALARY" , "GET_ALL_SALARY"));
  await runMiddleware(req, res, validate(req, res));

  if (req.method === "GET") {
    await salaryController.getSalaries(req, res);
  }
});

export default connectDB(handler);
