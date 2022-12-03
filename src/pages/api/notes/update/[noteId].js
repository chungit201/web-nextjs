import {auth, connectDB, validate} from "server/middlewares";
import {noteController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {updateNote} from "server/validations/note.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, updateNote));

  if (req.method === "POST") {
    await noteController.updateNote(req, res);
  }
});

export default connectDB(handler);
