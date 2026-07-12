const express = require('express')
const router = express.Router()
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Protect all routes under this router
router.use(authMiddleware)
router.use(authorizeRoles('fleet_manager'))

router.route('/')
  .post(createUser)
  .get(getAllUsers)

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser)

module.exports = router
