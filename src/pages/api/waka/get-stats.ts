import connectDB from "server/middlewares/mongodb.middleware";
import { User } from "server/models";
import {getWakaStats} from "../../../server/services/wakatime.service";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const allUsers = await User.find();
    if (allUsers) {
      const data = [];
      for (let user of allUsers) {
        if (user.wakaTimeToken && user.wakaTimeToken !== "") {
          // const today = new Date();
          // const startDay = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
          try {
            const summaryData = await getWakaStats("last_7_days", user.wakaTimeToken);
            const categories = summaryData['data']['categories'];
            const codingCategory = categories.find(x => x.name === "Coding");
            if (codingCategory) {
              data.push({
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
                ...codingCategory,
              });
            }
          } catch (e) {
            // maybe some error occurred
            console.error(e);
          }
        }
      }
      res.json({
        status: 200,
        data,
      });
    }
  }
};

export default connectDB(handler);
