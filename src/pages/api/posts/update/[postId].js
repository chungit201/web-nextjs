import {auth, connectDB, validate} from "server/middlewares";
import {postController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {postValidation} from "server/validations";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, postValidation.updatePost));

  if (req.method === "POST") {
    await postController.updatePost(req, res);
  }
});

export default connectDB(handler);