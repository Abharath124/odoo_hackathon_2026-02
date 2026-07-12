const { Expense, Vehicle } = require('../models')

// POST /api/expenses — add expense (fleet_manager only)
const addExpense = async (req, res) => {
  try {
    const { vehicle_id, expense_type, amount, description } = req.body

    if (!vehicle_id || !expense_type || amount === undefined) {
      return res.status(400).json({ message: 'vehicle_id, expense_type, and amount are required.' })
    }

    const validExpenseTypes = ['toll', 'repair', 'service', 'insurance']
    if (!validExpenseTypes.includes(expense_type)) {
      return res.status(400).json({ message: 'Invalid expense_type. Allowed types: toll, repair, service, insurance.' })
    }

    const vehicle = await Vehicle.findByPk(vehicle_id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' })
    }

    const expense = await Expense.create({
      vehicle_id,
      expense_type,
      amount,
      description,
    })

    return res.status(201).json({
      message: 'Expense added successfully.',
      expense,
    })
  } catch (error) {
    console.error('Add expense error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/expenses — get all expenses (fleet_manager, financial_analyst)
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [{ model: Vehicle, as: 'vehicle' }],
    })
    return res.status(200).json(expenses)
  } catch (error) {
    console.error('Get all expenses error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// GET /api/expenses/:id — get single expense
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params
    const expense = await Expense.findByPk(id, {
      include: [{ model: Vehicle, as: 'vehicle' }],
    })

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' })
    }

    return res.status(200).json(expense)
  } catch (error) {
    console.error('Get expense error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// DELETE /api/expenses/:id — delete (fleet_manager only)
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params
    const expense = await Expense.findByPk(id)

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found.' })
    }

    await expense.destroy()

    return res.status(200).json({ message: 'Expense deleted successfully.' })
  } catch (error) {
    console.error('Delete expense error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  addExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpense,
}
