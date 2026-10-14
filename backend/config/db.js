
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    console.log("Mongoose version:", mongoose.version);

    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 10000,
      family: 4,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Error name:", error.name);

    if (error.reason?.servers) {
      for (const [address, server] of error.reason.servers) {
        console.error("MongoDB server:", address);
        console.error(
          "Underlying error:",
          server.error?.message ?? "No additional details"
        );
      }
    }

    throw error;
  }
};

export default connectDB;
