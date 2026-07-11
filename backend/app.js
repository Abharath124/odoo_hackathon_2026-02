const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running.' })
})

// Routes
app.use('/api/auth', authRoutes)

module.exports = app
