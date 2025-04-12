import mongoose, { Connection } from "mongoose";

let isConnected = false;

export const connectMongoose = async () => {
  if (isConnected) {
    console.log("=> Using existing MongoDB connection");
    return;
  }

  try {
    // Set up connection options with timeout and retry settings
    const options = {
      serverSelectionTimeoutMS: 20000, // Timeout after 20 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 30000, // Timeout connection after 30 seconds
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    await mongoose.connect(process.env.MONGODB_URL as string, options);
    
    isConnected = true;
    console.log("MongoDB connection successful");
    
    (mongoose.connection as Connection).on("error", (err: any) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    // Handle disconnection
    (mongoose.connection as Connection).on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });
    
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    isConnected = false;
    
    // Retry connection after 5 seconds
    console.log("Retrying connection in 5 seconds...");
    setTimeout(() => connectMongoose(), 5000);
  }
};
