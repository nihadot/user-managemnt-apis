import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export async function connectDB() {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    console.log(`Database: ${connection.connection.db?.databaseName}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}
