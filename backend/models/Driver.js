const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  license_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  license_expiry: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  safety_score: {
    type: DataTypes.FLOAT,
    defaultValue: 100,
  },
  status: {
    type: DataTypes.ENUM('available', 'on_trip', 'suspended'),
    defaultValue: 'available',
    allowNull: false,
  },
},
{
  tableName: 'drivers',
  timestamps: true,
})

module.exports = Driver
