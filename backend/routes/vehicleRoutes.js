const express = require('express')
const router = express.Router()
const {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Authenticate all routes
router.use(authMiddleware)

router.route('/')
  .post(authorizeRoles('fleet_manager'), addVehicle)
  .get(authorizeRoles('fleet_manager', 'safety_officer', 'financial_analyst'), getAllVehicles)

router.route('/:id')
  .get(authorizeRoles('fleet_manager', 'safety_officer', 'financial_analyst'), getVehicleById)
  .put(authorizeRoles('fleet_manager'), updateVehicle)
  .delete(authorizeRoles('fleet_manager'), deleteVehicle)

module.exports = router
