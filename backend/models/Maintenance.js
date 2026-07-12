const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  issue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed'),
    defaultValue: 'in_progress',
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
},
{
  tableName: 'maintenance',
  timestamps: true,
})

module.exports = Maintenance
