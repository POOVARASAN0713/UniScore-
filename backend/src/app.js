const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

// On-demand Serverless Database Connection Middleware
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  const connURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/uniscore';
  try {
    const db = await mongoose.connect(connURI);
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

// Mount APIs
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ msg: 'API route not found' });
});

module.exports = app;
