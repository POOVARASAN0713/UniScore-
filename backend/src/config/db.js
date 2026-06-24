const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uniscore';
    await mongoose.connect(connURI);
    console.log(`MongoDB Connected to: ${connURI}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
