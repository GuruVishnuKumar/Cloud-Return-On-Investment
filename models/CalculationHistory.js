const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CalculationHistory = sequelize.define('CalculationHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cloudCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    revenue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    roiPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return CalculationHistory;
};
