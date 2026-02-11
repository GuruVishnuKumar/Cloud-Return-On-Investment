const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
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

db.User = require("./User")(sequelize);
db.Plan = require("./Plan")(sequelize);
db.Analytics = require("./Analytics")(sequelize);
db.CalculationHistory = require("./CalculationHistory")(sequelize);

module.exports = db;
