const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  registration_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  vehicle_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicle_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  max_capacity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  acquisition_cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  odometer: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('available', 'on_trip', 'in_shop'),
    defaultValue: 'available',
    allowNull: false,
  },
},
{
  tableName: 'vehicles',
  timestamps: true,
})

module.exports = Vehicle
