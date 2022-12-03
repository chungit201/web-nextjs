import {auth, connectDB, validate} from "server/middlewares";
import {commentController} from "server/controllers";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";
import {deleteComments} from "server/validations/comment.validation";
import errorMiddleware from "server/middlewares/error.middleware";

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, deleteComments));

  if (req.method === "POST") {
    try {
      await commentController.deleteComment(req, res);
    } catch (e) {
      errorMiddleware(e, req, res);
    }
  }
});

export default connectDB(handler);