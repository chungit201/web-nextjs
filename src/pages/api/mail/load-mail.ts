import Email from "server/models/email.model";
import {auth, connectDB} from "server/middlewares";
import middlewares from "server";
import {runMiddleware} from "server/utils/middleware-handler";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const mailId = req.body.id;
    await middlewares(req, res);
    await runMiddleware(req, res, auth(req, res));

    const email = await Email.findOne({
      owner: req.user._id,
      _id: mailId
    });
    if (email) {
      res.json(email.toObject())
    } else {
      res.status(404).json({
        msg: "Not available."
      })
    }
  }
};

export default connectDB(handler);
