require('dotenv').config(); // Load environment variables


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

sequelize.sync({ force: true }).then(() => {
  app.listen(process.env.PORT, () => { // Use PORT from .env
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch(err => console.log('Error: ' + err));