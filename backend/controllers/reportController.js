const { Vehicle, Trip, FuelLog, Maintenance, Expense, Driver } = require('../models')

// GET /api/reports/fuel-efficiency — per vehicle: total fuel used vs distance (fleet_manager, financial_analyst)
const getFuelEfficiencyReport = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Trip, as: 'trips' }],
    })

    const report = vehicles.map(vehicle => {
      let totalDistance = 0
      let totalFuelUsed = 0

      if (vehicle.trips && vehicle.trips.length > 0) {
        vehicle.trips.forEach(trip => {
          if (trip.status === 'completed') {
            totalDistance += trip.distance || 0
            totalFuelUsed += trip.fuel_used || 0
          }
        })
      }

      // Efficiency calculation (km per fuel unit or distance/fuel)
      const fuelEfficiency = totalFuelUsed > 0 ? (totalDistance / totalFuelUsed) : 0

      return {
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.vehicle_name,
        registration_number: vehicle.registration_number,
        total_distance: totalDistance,
        total_fuel_used: totalFuelUsed,
        fuel_efficiency: parseFloat(fuelEfficiency.toFixed(2)),
      }
    })

    return res.status(200).json(report)
  } catch (error) {
    console.error('Fuel efficiency report error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/reports/operational-cost — per vehicle: sum of fuel cost + maintenance cost + expenses (fleet_manager, financial_analyst)
const getOperationalCostReport = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [
        { model: FuelLog, as: 'fuelLogs' },
        { model: Maintenance, as: 'maintenances' },
        { model: Expense, as: 'expenses' },
      ],
    })

    const report = vehicles.map(vehicle => {
      const fuelCost = vehicle.fuelLogs
        ? vehicle.fuelLogs.reduce((sum, log) => sum + (log.total_cost || 0), 0)
        : 0

      const maintenanceCost = vehicle.maintenances
        ? vehicle.maintenances.reduce((sum, record) => sum + (record.cost || 0), 0)
        : 0

      const expenseCost = vehicle.expenses
        ? vehicle.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
        : 0

      const totalCost = fuelCost + maintenanceCost + expenseCost

      return {
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.vehicle_name,
        registration_number: vehicle.registration_number,
        fuel_cost: fuelCost,
        maintenance_cost: maintenanceCost,
        expense_cost: expenseCost,
        total_operational_cost: totalCost,
      }
    })

    return res.status(200).json(report)
  } catch (error) {
    console.error('Operational cost report error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/reports/fleet-utilization — trips count and distance per vehicle (fleet_manager, financial_analyst)
const getFleetUtilizationReport = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [{ model: Trip, as: 'trips' }],
    })

    const report = vehicles.map(vehicle => {
      const tripsCount = vehicle.trips ? vehicle.trips.length : 0
      const totalDistance = vehicle.trips
        ? vehicle.trips.reduce((sum, trip) => sum + (trip.distance || 0), 0)
        : 0

      return {
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.vehicle_name,
        registration_number: vehicle.registration_number,
        trips_count: tripsCount,
        total_distance: totalDistance,
      }
    })

    return res.status(200).json(report)
  } catch (error) {
    console.error('Fleet utilization report error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/reports/export/expenses — export expenses as CSV download (financial_analyst, fleet_manager)
const exportExpensesCSV = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['registration_number', 'vehicle_name'] }],
    })

    let csvContent = 'ID,Vehicle Registration,Vehicle Name,Expense Type,Amount,Description,DateCreated\n'
    expenses.forEach(exp => {
      const reg = exp.vehicle ? exp.vehicle.registration_number : 'N/A'
      const name = exp.vehicle ? exp.vehicle.vehicle_name : 'N/A'
      const desc = exp.description ? exp.description.replace(/"/g, '""') : ''
      csvContent += `${exp.id},"${reg}","${name}","${exp.expense_type}",${exp.amount},"${desc}","${exp.createdAt}"\n`
    })

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"')
    return res.status(200).send(csvContent)
  } catch (error) {
    console.error('Export expenses CSV error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/reports/export/fuel-logs — export fuel logs as CSV download (financial_analyst, fleet_manager)
const exportFuelLogsCSV = async (req, res) => {
  try {
    const fuelLogs = await FuelLog.findAll({
      include: [
        { model: Trip, as: 'trip', attributes: ['source', 'destination'] },
        { model: Vehicle, as: 'vehicle', attributes: ['registration_number', 'vehicle_name'] },
        { model: Driver, as: 'driver', attributes: ['name', 'license_number'] },
      ],
    })

    let csvContent = 'ID,Trip ID,Trip Source,Trip Destination,Vehicle Reg,Vehicle Name,Driver Name,Driver License,Fuel Amount,Cost Per Unit,Total Cost,DateCreated\n'
    fuelLogs.forEach(log => {
      const src = log.trip ? log.trip.source : 'N/A'
      const dest = log.trip ? log.trip.destination : 'N/A'
      const reg = log.vehicle ? log.vehicle.registration_number : 'N/A'
      const vName = log.vehicle ? log.vehicle.vehicle_name : 'N/A'
      const dName = log.driver ? log.driver.name : 'N/A'
      const dLic = log.driver ? log.driver.license_number : 'N/A'

      csvContent += `${log.id},${log.trip_id},"${src}","${dest}","${reg}","${vName}","${dName}","${dLic}",${log.fuel_amount},${log.cost_per_unit},${log.total_cost},"${log.createdAt}"\n`
    })

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="fuel-logs.csv"')
    return res.status(200).send(csvContent)
  } catch (error) {
    console.error('Export fuel logs CSV error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  getFuelEfficiencyReport,
  getOperationalCostReport,
  getFleetUtilizationReport,
  exportExpensesCSV,
  exportFuelLogsCSV,
}
