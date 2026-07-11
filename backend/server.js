const app = require('./app')
const { connectDB } = require('./config/db')
require('dotenv').config()

// Import all models here so Sequelize registers them before sync
require('./models/User')

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()
