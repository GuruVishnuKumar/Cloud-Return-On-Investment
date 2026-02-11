

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./models');
const { sequelize } = db;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection and Sync
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync(); // Sync models with DB
  })
  .then(async () => {
    console.log('Database synced');
    // Seed Plans if not exist
    const count = await db.Plan.count();
    if (count === 0) {
      await db.Plan.bulkCreate([
        { name: 'Basic', minUsers: 50, maxUsers: 500, pricePerUser: 100 },
        { name: 'Pro', minUsers: 500, maxUsers: 1500, pricePerUser: 80 },
        { name: 'Enterprise', minUsers: 1500, maxUsers: 3000, pricePerUser: 60 }
      ]);
      console.log('Plans seeded');
    }
  })
  .catch(err => console.log('Error: ' + err));

// Routes
app.use('/api/plans', require('./routes/plans'));
app.use('/api/roi', require('./routes/roi'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/', (req, res) => res.send('API Running'));

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
