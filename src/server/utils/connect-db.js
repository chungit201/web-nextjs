import mongoose from "mongoose";

const connectDb = () => {
  return new Promise(async (resolve) => {
    if (!mongoose.connection.readyState) {
      console.log("Starting new Mongo DB connection...");
      await mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
    }
    resolve();
  })
}
module.exports = connectDb;
