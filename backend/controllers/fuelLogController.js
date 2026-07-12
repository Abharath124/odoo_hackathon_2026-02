const { FuelLog, Trip, Vehicle, Driver } = require('../models')

// POST /api/fuel-logs — add fuel log (fleet_manager, driver)
const addFuelLog = async (req, res) => {
  try {
    const { trip_id, vehicle_id, driver_id, fuel_amount, cost_per_unit } = req.body

    if (!trip_id || !vehicle_id || !driver_id || fuel_amount === undefined || cost_per_unit === undefined) {
      return res.status(400).json({ message: 'trip_id, vehicle_id, driver_id, fuel_amount, and cost_per_unit are required.' })
    }

    // Check references exist
    const trip = await Trip.findByPk(trip_id)
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' })
    }

    const vehicle = await Vehicle.findByPk(vehicle_id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' })
    }

    const driver = await Driver.findByPk(driver_id)
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' })
    }

    const total_cost = fuel_amount * cost_per_unit

    const fuelLog = await FuelLog.create({
      trip_id,
      vehicle_id,
      driver_id,
      fuel_amount,
      cost_per_unit,
      total_cost,
    })

    return res.status(201).json({
      message: 'Fuel log added successfully.',
      fuelLog,
    })
  } catch (error) {
    console.error('Add fuel log error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/fuel-logs — get all fuel logs (fleet_manager, financial_analyst)
const getAllFuelLogs = async (req, res) => {
  try {
    const fuelLogs = await FuelLog.findAll({
      include: [
        { model: Trip, as: 'trip' },
        { model: Vehicle, as: 'vehicle' },
        { model: Driver, as: 'driver' },
      ],
    })
    return res.status(200).json(fuelLogs)
  } catch (error) {
    console.error('Get all fuel logs error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/fuel-logs/:id — get single fuel log
const getFuelLogById = async (req, res) => {
  try {
    const { id } = req.params
    const fuelLog = await FuelLog.findByPk(id, {
      include: [
        { model: Trip, as: 'trip' },
        { model: Vehicle, as: 'vehicle' },
        { model: Driver, as: 'driver' },
      ],
    })

    if (!fuelLog) {
      return res.status(404).json({ message: 'Fuel log not found.' })
    }

    return res.status(200).json(fuelLog)
  } catch (error) {
    console.error('Get fuel log error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// DELETE /api/fuel-logs/:id — delete (fleet_manager only)
const deleteFuelLog = async (req, res) => {
  try {
    const { id } = req.params
    const fuelLog = await FuelLog.findByPk(id)

    if (!fuelLog) {
      return res.status(404).json({ message: 'Fuel log not found.' })
    }

    await fuelLog.destroy()

    return res.status(200).json({ message: 'Fuel log deleted successfully.' })
  } catch (error) {
    console.error('Delete fuel log error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  addFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  deleteFuelLog,
}
