import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'
import { apiForgotPassword } from '../../services/authService'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    if (!email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      showError(validationError)
      return
    }
    try {
      setLoading(true)
      await apiForgotPassword({ email })
      showSuccess('OTP sent to your email!')
      navigate('/verify-otp', { state: { email, isReset: true } })
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Forgot Password?</h1>
              <p className="text-gray-500 mt-2 text-sm">
                No worries! Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              {/* Email Field */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 ${
                    error
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300 bg-white focus:border-indigo-400'
                  }`}
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition text-sm cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {/* Back to Login */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition"
              >
                Back to Login
              </Link>
            </p>

      </div>
    </div>
  )
}

export default ForgotPassword
