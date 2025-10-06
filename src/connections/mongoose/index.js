const mongoose = require("mongoose");
const env = require("../../../config/env.config");

async function connectMongoDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = { connectMongoDB };
