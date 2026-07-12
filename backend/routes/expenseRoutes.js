const express = require('express')
const router = express.Router()
const {
  addExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpense,
} = require('../controllers/expenseController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Protect all routes with authentication
router.use(authMiddleware)

router.route('/')
  .post(authorizeRoles('fleet_manager'), addExpense)
  .get(authorizeRoles('fleet_manager', 'financial_analyst'), getAllExpenses)

router.route('/:id')
  .get(getExpenseById)
  .delete(authorizeRoles('fleet_manager'), deleteExpense)

module.exports = router
