const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const { sendOtpEmail, sendVerificationEmail } = require('../services/emailService')

// ── Generate 6-digit OTP ──────────────────────────────────────
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

// ── POST /api/auth/signup ─────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verification_token = crypto.randomBytes(32).toString('hex')

    await User.create({
      name,
      email,
      password: hashedPassword,
      verification_token,
      is_verified: false,
    })

    await sendVerificationEmail(email, verification_token)

    return res.status(201).json({
      message: 'Account created. Please check your email to verify your account.',
    })
  } catch (error) {
    console.error('Signup error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// ── GET /api/auth/verify-email?token=xxx ──────────────────────
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({ message: 'Verification token is missing.' })
    }

    const user = await User.findOne({ where: { verification_token: token } })
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' })
    }

    if (user.is_verified) {
      return res.status(200).json({ message: 'Email already verified. Please login.' })
    }

    await user.update({ is_verified: true, verification_token: null })

    return res.status(200).json({ message: 'Email verified successfully! You can now login.' })
  } catch (error) {
    console.error('Verify email error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// ── POST /api/auth/login ──────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'Email not found.' })
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Email not verified. Please check your email and click the verification link.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password.' })
    }

    const token = generateToken(user.id)

    return res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// ── POST /api/auth/forgot-password ───────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'Email not found.' })
    }

    const otp = generateOtp()
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await user.update({ otp, otp_expires_at })

    await sendOtpEmail(email, otp)

    return res.status(200).json({
      message: 'OTP sent to your email.',
    })
  } catch (error) {
    console.error('Forgot password error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// ── POST /api/auth/verify-otp ─────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'Email not found.' })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' })
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })
    }

    await user.update({ is_verified: true, otp: null, otp_expires_at: null })

    return res.status(200).json({ message: 'OTP verified successfully.' })
  } catch (error) {
    console.error('Verify OTP error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// ── POST /api/auth/reset-password ────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'Email not found.' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await user.update({ password: hashedPassword })

    return res.status(200).json({ message: 'Password reset successfully.' })
  } catch (error) {
    console.error('Reset password error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

// ── POST /api/auth/resend-otp ────────────────────────────────
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required.' })

    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(404).json({ message: 'Email not found.' })

    const otp = generateOtp()
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000)

    await user.update({ otp, otp_expires_at })
    await sendOtpEmail(email, otp)

    return res.status(200).json({ message: 'OTP resent successfully.' })
  } catch (error) {
    console.error('Resend OTP error:', error.message)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}

module.exports = { signup, verifyEmail, login, forgotPassword, verifyOtp, resetPassword, resendOtp }
