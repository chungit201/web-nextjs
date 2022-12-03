import { auth, connectDB, validate, upload } from "server/middleware";
import { userController } from "server/controllers";
import middlewares from "server";
import { runMiddleware } from "server/utils/middleware-handler";
import { updateSelfProfile } from "server/validations/user.validation";
import uploadConfig from "server/config/upload.config";

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = (async (req, res) => {
  await middlewares(req, res);
  await runMiddleware(req, res, auth(req, res));
  await runMiddleware(req, res, validate(req, res, updateSelfProfile));
  await runMiddleware(req, res, upload(req, res, uploadConfig.avatar.exts));

  if (req.method === "POST") {
    await userController.updateSelfProfile(req, res);
  }
});

export default connectDB(handler);