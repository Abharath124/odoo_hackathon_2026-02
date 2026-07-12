const { Vehicle, Driver, Trip } = require('../models')

// GET /api/dashboard/stats — protected by authMiddleware, accessible to fleet_manager only
const getDashboardStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.count()
    const availableVehicles = await Vehicle.count({ where: { status: 'available' } })
    const vehiclesOnTrip = await Vehicle.count({ where: { status: 'on_trip' } })
    const vehiclesInShop = await Vehicle.count({ where: { status: 'in_shop' } })

    const totalDrivers = await Driver.count()
    const availableDrivers = await Driver.count({ where: { status: 'available' } })

    const activeTrips = await Trip.count({ where: { status: 'active' } })
    const pendingTrips = await Trip.count({ where: { status: 'pending' } })
    const completedTrips = await Trip.count({ where: { status: 'completed' } })

    // Percentage: vehiclesOnTrip / totalVehicles * 100
    const fleetUtilization = totalVehicles > 0 ? (vehiclesOnTrip / totalVehicles) * 100 : 0

    return res.status(200).json({
      totalVehicles,
      availableVehicles,
      vehiclesOnTrip,
      vehiclesInShop,
      totalDrivers,
      availableDrivers,
      activeTrips,
      pendingTrips,
      completedTrips,
      fleetUtilization,
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  getDashboardStats,
}
