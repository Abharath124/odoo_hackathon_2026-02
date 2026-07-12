const { sequelize } = require('../config/db')
const { User, Vehicle, Driver, Trip, Maintenance, FuelLog, Expense } = require('../models/index')
const bcrypt = require('bcryptjs')

async function main() {
  try {
    console.log('Authenticating database connection...')
    await sequelize.authenticate()
    console.log('Authentication successful!')

    // 1. Users
    const saltRounds = 10
    const userSeeds = [
      { id: 1, name: 'Admin Manager', email: 'manager@transitops.com', password: await bcrypt.hash('Admin@123', saltRounds), role: 'fleet_manager', is_verified: true },
      { id: 2, name: 'Rakesh Kumar', email: 'driver@transitops.com', password: await bcrypt.hash('Driver@123', saltRounds), role: 'driver', is_verified: true },
      { id: 3, name: 'Priya Shah', email: 'safety@transitops.com', password: await bcrypt.hash('Safety@123', saltRounds), role: 'safety_officer', is_verified: true },
      { id: 4, name: 'Ankit Mehta', email: 'finance@transitops.com', password: await bcrypt.hash('Finance@123', saltRounds), role: 'financial_analyst', is_verified: true }
    ]
    console.log('Seeding Users...')
    await User.bulkCreate(userSeeds, { ignoreDuplicates: true })

    // 2. Vehicles
    const vehicleSeeds = [
      { id: 1, registration_number: 'GJ01AB4521', vehicle_name: 'VAN-05', vehicle_type: 'Van', max_capacity: 500, acquisition_cost: 620000, odometer: 74000, status: 'available' },
      { id: 2, registration_number: 'GJ01AB9981', vehicle_name: 'TRUCK-11', vehicle_type: 'Truck', max_capacity: 5000, acquisition_cost: 2450000, odometer: 182000, status: 'on_trip' },
      { id: 3, registration_number: 'GJ01AB1120', vehicle_name: 'MINI-03', vehicle_type: 'Mini', max_capacity: 1000, acquisition_cost: 410000, odometer: 66000, status: 'in_shop' },
      { id: 4, registration_number: 'GJ01AB0087', vehicle_name: 'VAN-09', vehicle_type: 'Van', max_capacity: 750, acquisition_cost: 590000, odometer: 241900, status: 'available' },
      { id: 5, registration_number: 'GJ01AB2244', vehicle_name: 'BUS-01', vehicle_type: 'Bus', max_capacity: 3000, acquisition_cost: 1800000, odometer: 95000, status: 'available' },
      { id: 6, registration_number: 'GJ01AB5566', vehicle_name: 'TRX-12', vehicle_type: 'Truck', max_capacity: 4500, acquisition_cost: 2200000, odometer: 110000, status: 'on_trip' }
    ]
    console.log('Seeding Vehicles...')
    await Vehicle.bulkCreate(vehicleSeeds, { ignoreDuplicates: true })

    // 3. Drivers
    const driverSeeds = [
      { id: 1, name: 'Rakesh Kumar', license_number: 'DL-RK-001', category: 'HMV', license_expiry: '2027-06-30', contact: '9876543210', safety_score: 92, status: 'available' },
      { id: 2, name: 'Suresh Raina', license_number: 'DL-SR-002', category: 'LMV', license_expiry: '2028-09-15', contact: '9876543211', safety_score: 88, status: 'available' },
      { id: 3, name: 'Sarah Kim', license_number: 'DL-SK-003', category: 'LMV', license_expiry: '2029-01-10', contact: '9876543212', safety_score: 91, status: 'available' },
      { id: 4, name: 'Old Driver', license_number: 'DL-OD-004', category: 'HMV', license_expiry: '2024-05-20', contact: '9876543213', safety_score: 75, status: 'available' },
      { id: 5, name: 'Suspended Driver', license_number: 'DL-SD-005', category: 'LMV', license_expiry: '2027-12-31', contact: '9876543214', safety_score: 60, status: 'suspended' }
    ]
    console.log('Seeding Drivers...')
    await Driver.bulkCreate(driverSeeds, { ignoreDuplicates: true })

    // 4. Trips
    const tripSeeds = [
      { id: 1, source: 'Gandhinagar Depot', destination: 'Ahmedabad Hub', vehicle_id: 1, driver_id: 1, cargo_weight: 450, distance: 38, status: 'completed', start_odometer: 73500, end_odometer: 73538, fuel_used: 4.5, dispatched_by: 1 },
      { id: 2, source: 'Vatva Industrial Area', destination: 'Sanand Warehouse', vehicle_id: 2, driver_id: 2, cargo_weight: 4000, distance: 45, status: 'completed', start_odometer: 181950, end_odometer: 181995, fuel_used: 12.0, dispatched_by: 1 },
      { id: 3, source: 'Mansa', destination: 'Kalol Depot', vehicle_id: 3, driver_id: 3, cargo_weight: 800, distance: 22, status: 'completed', start_odometer: 65978, end_odometer: 66000, fuel_used: 2.5, dispatched_by: 1 },
      { id: 4, source: 'Ahmedabad', destination: 'Gandhinagar', vehicle_id: 2, driver_id: 2, cargo_weight: 3500, distance: 30, status: 'active', start_odometer: 182000, end_odometer: null, fuel_used: null, dispatched_by: 1 },
      { id: 5, source: 'Mehsana', destination: 'Palanpur', vehicle_id: 6, driver_id: 3, cargo_weight: 4200, distance: 75, status: 'active', start_odometer: 110000, end_odometer: null, fuel_used: null, dispatched_by: 1 },
      { id: 6, source: 'Surat', destination: 'Baroda', vehicle_id: 1, driver_id: 1, cargo_weight: 300, distance: 150, status: 'pending', start_odometer: null, end_odometer: null, fuel_used: null, dispatched_by: 1 },
      { id: 7, source: 'Rajkot', destination: 'Jamnagar', vehicle_id: 4, driver_id: 2, cargo_weight: 600, distance: 90, status: 'pending', start_odometer: null, end_odometer: null, fuel_used: null, dispatched_by: 1 },
      { id: 8, source: 'Anand', destination: 'Nadiad', vehicle_id: 5, driver_id: 3, cargo_weight: 2500, distance: 20, status: 'pending', start_odometer: null, end_odometer: null, fuel_used: null, dispatched_by: 1 }
    ]
    console.log('Seeding Trips...')
    await Trip.bulkCreate(tripSeeds, { ignoreDuplicates: true })

    // 5. Maintenance
    const maintenanceSeeds = [
      { id: 1, vehicle_id: 1, issue: 'Oil Change', status: 'completed', cost: 280, start_date: '2026-07-01', end_date: '2026-07-02' },
      { id: 2, vehicle_id: 2, issue: 'Brake Service', status: 'completed', cost: 840, start_date: '2026-07-03', end_date: '2026-07-04' },
      { id: 3, vehicle_id: 3, issue: 'Full Inspection', status: 'in_progress', cost: null, start_date: '2026-07-10', end_date: null },
      { id: 4, vehicle_id: 5, issue: 'Engine Tune-Up', status: 'in_progress', cost: null, start_date: '2026-07-11', end_date: null },
      { id: 5, vehicle_id: 4, issue: 'Tire Rotation', status: 'completed', cost: 160, start_date: '2026-07-05', end_date: '2026-07-06' }
    ]
    console.log('Seeding Maintenance...')
    await Maintenance.bulkCreate(maintenanceSeeds, { ignoreDuplicates: true })

    // 6. Fuel Logs
    const fuelSeeds = [
      { id: 1, trip_id: 1, vehicle_id: 1, driver_id: 1, fuel_amount: 40, cost_per_unit: 1.5, total_cost: 60.0 },
      { id: 2, trip_id: 2, vehicle_id: 2, driver_id: 2, fuel_amount: 120, cost_per_unit: 1.4, total_cost: 168.0 },
      { id: 3, trip_id: 3, vehicle_id: 3, driver_id: 3, fuel_amount: 30, cost_per_unit: 1.5, total_cost: 45.0 },
      { id: 4, trip_id: 1, vehicle_id: 1, driver_id: 1, fuel_amount: 35, cost_per_unit: 1.6, total_cost: 56.0 },
      { id: 5, trip_id: 2, vehicle_id: 2, driver_id: 2, fuel_amount: 110, cost_per_unit: 1.5, total_cost: 165.0 }
    ]
    console.log('Seeding Fuel Logs...')
    await FuelLog.bulkCreate(fuelSeeds, { ignoreDuplicates: true })

    // 7. Expenses
    const expenseSeeds = [
      { id: 1, vehicle_id: 1, expense_type: 'toll', amount: 15.0, description: 'Highway crossing toll charge' },
      { id: 2, vehicle_id: 2, expense_type: 'repair', amount: 1200.0, description: 'AC Repair service' },
      { id: 3, vehicle_id: 3, expense_type: 'service', amount: 6200.0, description: 'Tyre change and alignment' },
      { id: 4, vehicle_id: 4, expense_type: 'insurance', amount: 25000.0, description: 'Annual insurance policy fee' },
      { id: 5, vehicle_id: 5, expense_type: 'toll', amount: 35.0, description: 'Multi-axle bridge toll' },
      { id: 6, vehicle_id: 1, expense_type: 'repair', amount: 320.0, description: 'Wiper and headlamp replacement' },
      { id: 7, vehicle_id: 2, expense_type: 'service', amount: 18000.0, description: 'Engine overhaul service' },
      { id: 8, vehicle_id: 6, expense_type: 'insurance', amount: 20000.0, description: 'Comprehensive fleet cover' }
    ]
    console.log('Seeding Expenses...')
    await Expense.bulkCreate(expenseSeeds, { ignoreDuplicates: true })

    console.log('\n=============================================================')
    console.log('SEEDING COMPLETED SUCCESSFULLY!')
    console.log('=============================================================')
    console.log('LOGIN CREDENTIALS REFERENCE TABLE:')
    console.log('-------------------------------------------------------------')
    console.log('Email                      | Password   | Role')
    console.log('-------------------------------------------------------------')
    console.log('manager@transitops.com     | Admin@123  | fleet_manager')
    console.log('driver@transitops.com      | Driver@123 | driver')
    console.log('safety@transitops.com      | Safety@123 | safety_officer')
    console.log('finance@transitops.com     | Finance@123| financial_analyst')
    console.log('=============================================================\n')

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await sequelize.close()
    console.log('Sequelize connection closed.')
  }
}

main()
