const express = require('express')
const router = express.Router()
const { getDashboardStats } = require('../controllers/dashboardController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Protect all routes with authentication
router.use(authMiddleware)

router.get('/stats', authorizeRoles('fleet_manager', 'driver', 'safety_officer', 'financial_analyst'), getDashboardStats)

module.exports = router
