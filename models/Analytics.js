const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Analytics = sequelize.define('Analytics', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY, // Store simply as YYYY-MM-DD
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    visitors: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    registrations: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Analytics;
};
