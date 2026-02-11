const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Plan = sequelize.define('Plan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Basic, Pro, Enterprise
    },
    minUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pricePerUser: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return Plan;
};
