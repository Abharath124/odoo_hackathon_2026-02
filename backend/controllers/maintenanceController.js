const { Maintenance, Vehicle } = require('../models')

// POST /api/maintenance — start maintenance for a vehicle (fleet_manager only)
const startMaintenance = async (req, res) => {
  try {
    const { vehicle_id, issue, start_date } = req.body

    if (!vehicle_id || !issue || !start_date) {
      return res.status(400).json({ message: 'vehicle_id, issue, and start_date are required.' })
    }

    const vehicle = await Vehicle.findByPk(vehicle_id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' })
    }

    if (vehicle.status === 'on_trip') {
      return res.status(400).json({ message: 'Vehicle is currently on a trip and cannot enter maintenance.' })
    }

    const maintenance = await Maintenance.create({
      vehicle_id,
      issue,
      start_date,
      status: 'in_progress',
    })

    vehicle.status = 'in_shop'
    await vehicle.save()

    return res.status(201).json({
      message: 'Maintenance started successfully.',
      maintenance,
    })
  } catch (error) {
    console.error('Start maintenance error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/maintenance — get all maintenance records (fleet_manager, financial_analyst)
const getAllMaintenance = async (req, res) => {
  try {
    const records = await Maintenance.findAll({
      include: [{ model: Vehicle, as: 'vehicle' }],
    })
    return res.status(200).json(records)
  } catch (error) {
    console.error('Get all maintenance error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/maintenance/:id — get single record
const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params
    const record = await Maintenance.findByPk(id, {
      include: [{ model: Vehicle, as: 'vehicle' }],
    })

    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found.' })
    }

    return res.status(200).json(record)
  } catch (error) {
    console.error('Get maintenance record error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// PATCH /api/maintenance/:id/complete — mark maintenance complete (fleet_manager only)
const completeMaintenance = async (req, res) => {
  try {
    const { id } = req.params
    const { cost, end_date } = req.body

    if (cost === undefined || !end_date) {
      return res.status(400).json({ message: 'cost and end_date are required.' })
    }

    const record = await Maintenance.findByPk(id)
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found.' })
    }

    if (record.status === 'completed') {
      return res.status(400).json({ message: 'Maintenance is already completed.' })
    }

    record.status = 'completed'
    record.cost = cost
    record.end_date = end_date
    await record.save()

    const vehicle = await Vehicle.findByPk(record.vehicle_id)
    if (vehicle) {
      vehicle.status = 'available'
      await vehicle.save()
    }

    return res.status(200).json({
      message: 'Maintenance marked as completed successfully.',
      maintenance: record,
    })
  } catch (error) {
    console.error('Complete maintenance error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// DELETE /api/maintenance/:id — delete record (fleet_manager only)
const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params
    const record = await Maintenance.findByPk(id)

    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found.' })
    }

    // Reset vehicle status back to available if deleting an ongoing maintenance
    if (record.status !== 'completed') {
      const vehicle = await Vehicle.findByPk(record.vehicle_id)
      if (vehicle) {
        vehicle.status = 'available'
        await vehicle.save()
      }
    }

    await record.destroy()

    return res.status(200).json({ message: 'Maintenance record deleted successfully.' })
  } catch (error) {
    console.error('Delete maintenance error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  startMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  completeMaintenance,
  deleteMaintenance,
}
