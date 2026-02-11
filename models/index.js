const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.Plan = require('./Plan')(sequelize, Sequelize);
db.CalculationHistory = require('./CalculationHistory')(sequelize, Sequelize);
db.Analytics = require('./Analytics')(sequelize, Sequelize);

// Associations can be defined here if needed
// db.User.hasMany(db.CalculationHistory);
// db.CalculationHistory.belongsTo(db.User);

module.exports = db;
