const express = require('express')
const router = express.Router()
const {
  getFuelEfficiencyReport,
  getOperationalCostReport,
  getFleetUtilizationReport,
  exportExpensesCSV,
  exportFuelLogsCSV,
} = require('../controllers/reportController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Protect all routes with authentication
router.use(authMiddleware)
router.use(authorizeRoles('fleet_manager', 'financial_analyst'))

router.get('/fuel-efficiency', getFuelEfficiencyReport)
router.get('/operational-cost', getOperationalCostReport)
router.get('/fleet-utilization', getFleetUtilizationReport)

router.get('/export/expenses', exportExpensesCSV)
router.get('/export/fuel-logs', exportFuelLogsCSV)

module.exports = router
