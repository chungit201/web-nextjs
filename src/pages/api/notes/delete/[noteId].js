import {auth, connectDB, validate} from "server/middlewares";
import {noteController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {deleteNote} from "server/validations/note.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, deleteNote));

  if (req.method === "POST") {
    await noteController.deleteNote(req, res);
  }
});

export default connectDB(handler);
