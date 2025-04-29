require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const targetRoutes = require('./routes/targetRoutes');
const monthlyDataRoutes = require('./routes/monthlyDataRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors({
  origin: ['https://finance-tracker-version-2.vercel.app', 'http://localhost:5173'],
  methods: 'POST, GET,  PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true 
}));
app.use(bodyParser.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', authRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/monthly-data', monthlyDataRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/transactions', transactionRoutes);

// NOTE: Setting force: false to prevent data loss in production
sequelize.sync({ force: false }).then(() => {
  app.listen(process.env.PORT, () => { // Use PORT from .env
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch(err => console.log('Error: ' + err));