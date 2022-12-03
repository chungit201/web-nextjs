import Email from "server/models/email.model";
import {auth, connectDB} from "server/middlewares";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";

const handler = async (req, res) => {
  if (req.method === "POST") {
    await middlewares(req, res);
    await runMiddleware(req, res, auth(req, res));
    const emails = await Email.find({
      owner: req.user._id
    });
    res.json({
      emails: emails.map(email => email.toObject())
    })
  }
};

export default connectDB(handler);
