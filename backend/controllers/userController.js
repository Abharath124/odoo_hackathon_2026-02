const bcrypt = require('bcryptjs')
const { User } = require('../models')

// Create User (name, email, password, role)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    const validRoles = ['fleet_manager', 'driver', 'safety_officer', 'financial_analyst']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      is_verified: true, // Provisioned directly by Fleet Manager
    })

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return res.status(201).json({
      message: 'User created successfully.',
      user: userResponse,
    })
  } catch (error) {
    console.error('Create user error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'otp', 'otp_expires_at', 'verification_token'] },
    })
    return res.status(200).json(users)
  } catch (error) {
    console.error('Get all users error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Get single user
const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'otp', 'otp_expires_at', 'verification_token'] },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('Get user by id error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Update user (name, role)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, role } = req.body

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (name) {
      user.name = name
    }

    if (role) {
      const validRoles = ['fleet_manager', 'driver', 'safety_officer', 'financial_analyst']
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role.' })
      }
      user.role = role
    }

    await user.save()

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return res.status(200).json({
      message: 'User updated successfully.',
      user: userResponse,
    })
  } catch (error) {
    console.error('Update user error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    await user.destroy()

    return res.status(200).json({ message: 'User deleted successfully.' })
  } catch (error) {
    console.error('Delete user error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}
