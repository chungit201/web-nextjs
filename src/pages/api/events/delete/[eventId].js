import {auth, connectDB, validate} from "server/middlewares";
import {eventController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {deleteEvent} from "server/validations/event.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, deleteEvent));

  if (req.method === "POST") {
    await eventController.deleteEvent(req, res);
  }
});

export default connectDB(handler)