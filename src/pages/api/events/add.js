import {auth, connectDB, validate} from "server/middlewares";
import {eventController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {createEvent} from "server/validations/event.validation";

const handler = (async(req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res , auth(req, res));
  await runMiddleware(req, res, validate(req, res, createEvent));

  if (req.method === "POST") {
    await eventController.addEvent(req, res);
  }
});

export default connectDB(handler)