import {auth, connectDB, validate} from "server/middlewares";
import {commentController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {getPost} from "server/validations/post.validation";
import errorMiddleware from "server/middlewares/error.middleware";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, getPost));
  if (req.method === "GET") {
    try {
      await commentController.getComments(req, res);
    } catch (e) {
      errorMiddleware(e, req, res);
    }
  }
});

export default connectDB(handler);