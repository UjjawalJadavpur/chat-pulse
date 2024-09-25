const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/SocketIo";
    console.log(`Attempting to connect to MongoDB at ${uri}`); // Debug information

    if (mongoose.connection.readyState === 0) { // 0 means disconnected
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
