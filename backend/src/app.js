const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

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
