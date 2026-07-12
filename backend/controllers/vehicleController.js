const { Vehicle } = require('../models')

// Add Vehicle (registration_number, vehicle_name, vehicle_type, max_capacity, acquisition_cost, odometer, status)
const addVehicle = async (req, res) => {
  try {
    const { registration_number, vehicle_name, vehicle_type, max_capacity, acquisition_cost, odometer, status } = req.body

    if (!registration_number || !vehicle_name || !vehicle_type || max_capacity === undefined || acquisition_cost === undefined) {
      return res.status(400).json({ message: 'registration_number, vehicle_name, vehicle_type, max_capacity, and acquisition_cost are required.' })
    }

    const existingVehicle = await Vehicle.findOne({ where: { registration_number } })
    if (existingVehicle) {
      return res.status(409).json({ message: 'Vehicle with this registration number already exists.' })
    }

    if (status) {
      const validStatuses = ['available', 'on_trip', 'in_shop']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Status must be available, on_trip, or in_shop.' })
      }
    }

    const vehicle = await Vehicle.create({
      registration_number,
      vehicle_name,
      vehicle_type,
      max_capacity,
      acquisition_cost,
      odometer: odometer !== undefined ? odometer : 0,
      status: status || 'available',
    })

    return res.status(201).json({
      message: 'Vehicle added successfully.',
      vehicle,
    })
  } catch (error) {
    console.error('Add vehicle error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll()
    return res.status(200).json(vehicles)
  } catch (error) {
    console.error('Get all vehicles error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Get single vehicle
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params
    const vehicle = await Vehicle.findByPk(id)

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' })
    }

    return res.status(200).json(vehicle)
  } catch (error) {
    console.error('Get vehicle error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Update vehicle (registration_number, vehicle_name, vehicle_type, max_capacity, acquisition_cost, odometer, status)
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params
    const { registration_number, vehicle_name, vehicle_type, max_capacity, acquisition_cost, odometer, status } = req.body

    const vehicle = await Vehicle.findByPk(id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' })
    }

    if (registration_number && registration_number !== vehicle.registration_number) {
      const existingVehicle = await Vehicle.findOne({ where: { registration_number } })
      if (existingVehicle) {
        return res.status(409).json({ message: 'Vehicle with this registration number already exists.' })
      }
      vehicle.registration_number = registration_number
    }

    if (vehicle_name) vehicle.vehicle_name = vehicle_name
    if (vehicle_type) vehicle.vehicle_type = vehicle_type
    if (max_capacity !== undefined) vehicle.max_capacity = max_capacity
    if (acquisition_cost !== undefined) vehicle.acquisition_cost = acquisition_cost
    if (odometer !== undefined) vehicle.odometer = odometer
    
    if (status) {
      const validStatuses = ['available', 'on_trip', 'in_shop']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Status must be available, on_trip, or in_shop.' })
      }
      vehicle.status = status
    }

    await vehicle.save()

    return res.status(200).json({
      message: 'Vehicle updated successfully.',
      vehicle,
    })
  } catch (error) {
    console.error('Update vehicle error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params
    const vehicle = await Vehicle.findByPk(id)

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' })
    }

    await vehicle.destroy()

    return res.status(200).json({ message: 'Vehicle deleted successfully.' })
  } catch (error) {
    console.error('Delete vehicle error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
}
