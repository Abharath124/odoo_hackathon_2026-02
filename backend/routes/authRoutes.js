const express = require('express')
const router = express.Router()
const {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
} = require('../controllers/authController')

router.post('/signup', signup)
router.get('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)
router.post('/resend-otp', resendOtp)

module.exports = router
