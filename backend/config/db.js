const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
)

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('MySQL connected successfully.')

    // Import all models to register them before sync
    require('../models/index')

    await sequelize.sync({ alter: true })
    console.log('All models synced with database.')
  } catch (error) {
    console.error('Database connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectDB }
