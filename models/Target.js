const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Target = sequelize.define('Target', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  targetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Assuming user authentication
  },
}, {
  tableName: 'targets',
  timestamps: true,
});

module.exports = Target;