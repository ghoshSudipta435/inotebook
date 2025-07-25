const mongoose = require('mongoose');
require('dotenv').config(); // Add this

const mongoURI = process.env.MONGO_URI;
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectToMongo;
