const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
const driverRoutes = require('./routes/driverRoutes')
const tripRoutes = require('./routes/tripRoutes')
const maintenanceRoutes = require('./routes/maintenanceRoutes')
const fuelLogRoutes = require('./routes/fuelLogRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const reportRoutes = require('./routes/reportRoutes')
const chatRoutes = require('./routes/chatRoutes')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running.' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/drivers', driverRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/fuel-logs', fuelLogRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/chat', chatRoutes)

module.exports = app
