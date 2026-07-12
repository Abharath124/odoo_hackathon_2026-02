const { Trip, Vehicle, Driver, User } = require('../models')

// POST /api/trips — create & dispatch trip (fleet_manager only)
const createTrip = async (req, res) => {
  try {
    const { source, destination, vehicle_id, driver_id, cargo_weight, distance } = req.body

    if (!source || !destination || !vehicle_id || !driver_id || cargo_weight === undefined || distance === undefined) {
      return res.status(400).json({ message: 'All fields (source, destination, vehicle_id, driver_id, cargo_weight, distance) are required.' })
    }

    const vehicle = await Vehicle.findByPk(vehicle_id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' })
    }

    const driver = await Driver.findByPk(driver_id)
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' })
    }

    // Business Rules
    if (vehicle.status !== 'available') {
      return res.status(400).json({ message: 'Selected vehicle is not available.' })
    }

    if (driver.status !== 'available') {
      return res.status(400).json({ message: 'Selected driver is not available.' })
    }

    // Check license expiry
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiryDate = new Date(driver.license_expiry)
    if (expiryDate < today) {
      return res.status(400).json({ message: "Selected driver's license is expired." })
    }

    // Cargo weight capacity check
    if (cargo_weight > vehicle.max_capacity) {
      return res.status(400).json({ message: `Cargo weight (${cargo_weight}) exceeds vehicle's max capacity (${vehicle.max_capacity}).` })
    }

    // Dispatching vehicle & driver
    const trip = await Trip.create({
      source,
      destination,
      vehicle_id,
      driver_id,
      cargo_weight,
      distance,
      status: 'pending',
      start_odometer: vehicle.odometer,
      dispatched_by: req.user.id,
    })

    vehicle.status = 'on_trip'
    await vehicle.save()

    driver.status = 'on_trip'
    await driver.save()

    return res.status(201).json({
      message: 'Trip created and dispatched successfully.',
      trip,
    })
  } catch (error) {
    console.error('Create trip error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/trips — get all trips (fleet_manager, financial_analyst)
const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Driver, as: 'driver' },
        { model: User, as: 'dispatchedBy', attributes: ['id', 'name', 'email'] }
      ]
    })
    return res.status(200).json(trips)
  } catch (error) {
    console.error('Get all trips error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/trips/my — get trips assigned to logged-in driver (driver only)
const getMyTrips = async (req, res) => {
  try {
    // Find driver matching logged-in user name
    const driver = await Driver.findOne({ where: { name: req.user.name } })
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found for this account.' })
    }

    const trips = await Trip.findAll({
      where: { driver_id: driver.id },
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: User, as: 'dispatchedBy', attributes: ['id', 'name', 'email'] }
      ]
    })

    return res.status(200).json(trips)
  } catch (error) {
    console.error('Get my trips error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/trips/:id — get single trip
const getTripById = async (req, res) => {
  try {
    const { id } = req.params
    const trip = await Trip.findByPk(id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Driver, as: 'driver' },
        { model: User, as: 'dispatchedBy', attributes: ['id', 'name', 'email'] }
      ]
    })

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' })
    }

    return res.status(200).json(trip)
  } catch (error) {
    console.error('Get trip error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// PATCH /api/trips/:id/start — driver starts trip, set status to 'active'
const startTrip = async (req, res) => {
  try {
    const { id } = req.params
    const trip = await Trip.findByPk(id)

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' })
    }

    // Verify this driver is assigned to this trip
    const driver = await Driver.findOne({ where: { name: req.user.name } })
    if (!driver || trip.driver_id !== driver.id) {
      return res.status(403).json({ message: 'Access denied. You are not assigned to this trip.' })
    }

    if (trip.status !== 'pending') {
      return res.status(400).json({ message: 'Trip cannot be started as it is not in pending status.' })
    }

    trip.status = 'active'
    await trip.save()

    return res.status(200).json({
      message: 'Trip started successfully.',
      trip,
    })
  } catch (error) {
    console.error('Start trip error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// PATCH /api/trips/:id/complete — driver completes trip, accepts end_odometer and fuel_used, set status to 'completed'
const completeTrip = async (req, res) => {
  try {
    const { id } = req.params
    const { end_odometer, fuel_used } = req.body

    if (end_odometer === undefined || fuel_used === undefined) {
      return res.status(400).json({ message: 'end_odometer and fuel_used are required.' })
    }

    const trip = await Trip.findByPk(id)
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' })
    }

    // Verify this driver is assigned to this trip
    const driver = await Driver.findOne({ where: { name: req.user.name } })
    if (!driver || trip.driver_id !== driver.id) {
      return res.status(403).json({ message: 'Access denied. You are not assigned to this trip.' })
    }

    if (trip.status !== 'active') {
      return res.status(400).json({ message: 'Trip can only be completed after being started.' })
    }

    if (end_odometer < trip.start_odometer) {
      return res.status(400).json({ message: `end_odometer (${end_odometer}) cannot be less than start_odometer (${trip.start_odometer}).` })
    }

    // Update trip details
    trip.status = 'completed'
    trip.end_odometer = end_odometer
    trip.fuel_used = fuel_used
    await trip.save()

    // Update vehicle
    const vehicle = await Vehicle.findByPk(trip.vehicle_id)
    if (vehicle) {
      vehicle.status = 'available'
      vehicle.odometer = end_odometer
      await vehicle.save()
    }

    // Update driver
    driver.status = 'available'
    await driver.save()

    return res.status(200).json({
      message: 'Trip completed successfully.',
      trip,
    })
  } catch (error) {
    console.error('Complete trip error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// DELETE /api/trips/:id — delete trip (fleet_manager only)
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params
    const trip = await Trip.findByPk(id)

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' })
    }

    // If deleting an ongoing trip, reset vehicle and driver status back to available
    if (trip.status !== 'completed') {
      const vehicle = await Vehicle.findByPk(trip.vehicle_id)
      if (vehicle) {
        vehicle.status = 'available'
        await vehicle.save()
      }

      const driver = await Driver.findByPk(trip.driver_id)
      if (driver) {
        driver.status = 'available'
        await driver.save()
      }
    }

    await trip.destroy()

    return res.status(200).json({ message: 'Trip deleted successfully.' })
  } catch (error) {
    console.error('Delete trip error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  createTrip,
  getAllTrips,
  getMyTrips,
  getTripById,
  startTrip,
  completeTrip,
  deleteTrip,
}
