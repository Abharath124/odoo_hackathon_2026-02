const express = require('express')
const router = express.Router()
const {
  addDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  suspendDriver,
  renewLicense,
} = require('../controllers/driverController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Authenticate all routes
router.use(authMiddleware)

router.route('/')
  .post(authorizeRoles('fleet_manager'), addDriver)
  .get(authorizeRoles('fleet_manager', 'safety_officer'), getAllDrivers)

router.route('/:id')
  .get(authorizeRoles('fleet_manager', 'safety_officer'), getDriverById)
  .put(authorizeRoles('fleet_manager', 'safety_officer'), updateDriver)
  .delete(authorizeRoles('fleet_manager'), deleteDriver)

router.patch('/:id/suspend', authorizeRoles('fleet_manager', 'safety_officer'), suspendDriver)
router.patch('/:id/renew-license', authorizeRoles('fleet_manager', 'safety_officer'), renewLicense)

module.exports = router
