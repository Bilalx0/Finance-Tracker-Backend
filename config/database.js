const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('budget_tracker', 'root', 'bilal458', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;