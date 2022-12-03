import Email from "server/models/email.model";
import {connectDB} from "server/middlewares";
import User from "server/models/user.model";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const receivedEmail = req.body;
    if (receivedEmail["X-Mailgun-Incoming"] === "Yes") {
      const user = await User.findOne({
        internalEmail: receivedEmail['recipient'].toLowerCase(),
      });
      await Email.create({
        owner: user ? user._id : undefined,
        creationTime: new Date(receivedEmail.Date).getTime(),
        sender: receivedEmail['sender'],
        from: receivedEmail['from'],
        recipient: receivedEmail['recipient'],
        subject: receivedEmail['subject'],
        strippedText: receivedEmail['stripped-text'],
        bodyHTML: receivedEmail['body-html'],
        data: receivedEmail
      });
      res.json({
        msg: 'Success'
      })
    } else {
      res.status(500).json({
        msg: "Unauthorized"
      })
    }
  }
};

export default connectDB(handler);
