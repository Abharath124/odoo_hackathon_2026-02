const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
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
  cargo_weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'completed'),
    defaultValue: 'pending',
    allowNull: false,
  },
  start_odometer: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  end_odometer: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  fuel_used: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  dispatched_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  tableName: 'trips',
  timestamps: true,
})

module.exports = Trip
