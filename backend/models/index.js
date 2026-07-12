const User = require('./User')
const Vehicle = require('./Vehicle')
const Driver = require('./Driver')
const Trip = require('./Trip')
const Maintenance = require('./Maintenance')
const FuelLog = require('./FuelLog')
const Expense = require('./Expense')

// Trip associations
Trip.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })
Trip.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' })
Trip.belongsTo(User, { foreignKey: 'dispatched_by', as: 'dispatchedBy' })
Vehicle.hasMany(Trip, { foreignKey: 'vehicle_id', as: 'trips' })
Driver.hasMany(Trip, { foreignKey: 'driver_id', as: 'trips' })

// Maintenance associations
Maintenance.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })
Vehicle.hasMany(Maintenance, { foreignKey: 'vehicle_id', as: 'maintenances' })

// FuelLog associations
FuelLog.belongsTo(Trip, { foreignKey: 'trip_id', as: 'trip' })
FuelLog.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })
FuelLog.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' })
Trip.hasOne(FuelLog, { foreignKey: 'trip_id', as: 'fuelLog' })
Vehicle.hasMany(FuelLog, { foreignKey: 'vehicle_id', as: 'fuelLogs' })
Driver.hasMany(FuelLog, { foreignKey: 'driver_id', as: 'fuelLogs' })

// Expense associations
Expense.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' })
Vehicle.hasMany(Expense, { foreignKey: 'vehicle_id', as: 'expenses' })

module.exports = { User, Vehicle, Driver, Trip, Maintenance, FuelLog, Expense }
