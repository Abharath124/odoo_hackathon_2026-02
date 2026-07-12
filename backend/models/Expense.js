const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expense_type: {
    type: DataTypes.ENUM('toll', 'repair', 'service', 'insurance'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
{
  tableName: 'expenses',
  timestamps: true,
})

module.exports = Expense
