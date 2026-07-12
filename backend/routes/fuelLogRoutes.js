const express = require('express')
const router = express.Router()
const {
  addFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  deleteFuelLog,
} = require('../controllers/fuelLogController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Protect all routes with authentication
router.use(authMiddleware)

router.route('/')
  .post(authorizeRoles('fleet_manager', 'driver'), addFuelLog)
  .get(authorizeRoles('fleet_manager', 'financial_analyst', 'driver'), getAllFuelLogs)

router.route('/:id')
  .get(getFuelLogById)
  .delete(authorizeRoles('fleet_manager'), deleteFuelLog)

module.exports = router
