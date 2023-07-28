import mongoose from "mongoose";
const config = require("./config");

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
