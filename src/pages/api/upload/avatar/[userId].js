import { auth, connectDB, validate, upload } from "server/middlewares";
import { multerUpload } from "server/middlewares/upload.middleware";
import { userController } from "server/controllers";
import middlewares from "server";
import { runMiddleware } from "server/utils/middleware-handler";

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, multerUpload(req, res));

  if (req.method === "PATCH") {
    await userController.updateSelfProfile(req, res);
  }
});

export default connectDB(handler);