import {auth, connectDB, validate} from "server/middlewares";
import {postController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getPost} from "server/validations/post.validation";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, getPost));
  if (req.method === "GET") {
    await postController.getPosts(req, res);
  }
});

export default connectDB(handler);