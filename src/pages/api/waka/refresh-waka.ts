import connectDB from "server/middlewares/mongodb.middleware";
import { User } from "server/models";
import {refreshWakaToken} from "../../../server/services/wakatime.service";
import {IWakaAuthResponse} from "../../../waka";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const allUsers = await User.find();
    if (allUsers) {
      for (let user of allUsers) {
        if (user.wakaTimeId && user.wakaTimeRefreshToken && user.wakaTimeRefreshToken !== "") {
          const newAuthData : IWakaAuthResponse = await refreshWakaToken(user.wakaTimeRefreshToken);
          await User.updateOne({
            _id: user._id
          }, {
            wakaTimeId: newAuthData.uid,
            wakaTimeToken: newAuthData.access_token,
            wakaTimeRefreshToken: newAuthData.refresh_token
          });
        }
      }
    }
  }
  res.json('ok')
};

export default connectDB(handler);
