const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const FuelLog = sequelize.define('FuelLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fuel_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cost_per_unit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
},
{
  tableName: 'fuel_logs',
  timestamps: true,
})

module.exports = FuelLog
