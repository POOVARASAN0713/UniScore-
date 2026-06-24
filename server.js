require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./backend/src/app');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uniscore';
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("⚠️ MongoDB connection error:", err.message);
    throw err;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ msg: "Database connection failed: " + err.message });
  }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}
