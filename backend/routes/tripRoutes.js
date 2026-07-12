const express = require('express')
const router = express.Router()
const {
  createTrip,
  getAllTrips,
  getMyTrips,
  getTripById,
  startTrip,
  completeTrip,
  deleteTrip,
} = require('../controllers/tripController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Protect all routes with authentication
router.use(authMiddleware)

router.route('/')
  .post(authorizeRoles('fleet_manager'), createTrip)
  .get(authorizeRoles('fleet_manager', 'financial_analyst'), getAllTrips)

router.get('/my', authorizeRoles('driver'), getMyTrips)

router.route('/:id')
  .get(getTripById) // Drivers, managers, safety and analysts should be able to query trip details
  .delete(authorizeRoles('fleet_manager'), deleteTrip)

router.patch('/:id/start', authorizeRoles('driver'), startTrip)
router.patch('/:id/complete', authorizeRoles('driver'), completeTrip)

module.exports = router
