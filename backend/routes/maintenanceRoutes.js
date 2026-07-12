const express = require('express')
const router = express.Router()
const {
  startMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  completeMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Protect all routes with authentication
router.use(authMiddleware)

router.route('/')
  .post(authorizeRoles('fleet_manager'), startMaintenance)
  .get(authorizeRoles('fleet_manager', 'financial_analyst'), getAllMaintenance)

router.route('/:id')
  .get(getMaintenanceById)
  .delete(authorizeRoles('fleet_manager'), deleteMaintenance)

router.patch('/:id/complete', authorizeRoles('fleet_manager'), completeMaintenance)

module.exports = router
