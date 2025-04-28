const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Target = sequelize.define('Target', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {  // Changed from targetName to match frontend
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {  // Changed from targetAmount to match frontend
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: () => new Date().getMonth() + 1 // Auto-set current month
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: () => new Date().getFullYear() // Auto-set current year
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'targets',
  timestamps: true,
});

module.exports = Target;