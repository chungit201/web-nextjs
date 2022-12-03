import mongoose from 'mongoose';
import errorHandler from "./error.middleware";

const connectDB = handler => async (req, res) => {
  try {
    if (mongoose.connections[0].readyState) {
      // Use current db connection
      return await handler(req, res);
    }
    // Use new db connection
    await mongoose.connect(process.env.MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    return await handler(req, res);
  } catch (e) {
    errorHandler(e, req, res);
  }
};

export default connectDB;