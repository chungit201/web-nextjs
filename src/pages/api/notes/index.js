import {auth, connectDB, validate} from "server/middlewares";
import {noteController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getNotes} from "server/validations/note.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, getNotes));
  if (req.method === "GET") {
    await noteController.getNotes(req, res);
  }
});

export default connectDB(handler);