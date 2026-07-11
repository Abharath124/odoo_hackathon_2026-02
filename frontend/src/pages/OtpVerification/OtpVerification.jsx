import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'
import { apiVerifyOtp, apiResendOtp } from '../../services/authService'

const OTP_LENGTH = 6
const RESEND_COUNTDOWN = 60

function OtpVerification() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(RESEND_COUNTDOWN)
  const [canResend, setCanResend] = useState(false)
  const [loading, setLoading] = useState(false)

  const inputRefs = useRef([])
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email || ''
  const isReset = location.state?.isReset || false

  // Redirect back if someone lands here directly without email
  useEffect(() => {
    if (!email) navigate('/forgot-password')
  }, [email, navigate])

  // Countdown timer for resend
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true)
      return
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '') // digits only
    if (!val) return

    const newOtp = [...otp]
    newOtp[index] = val.slice(-1) // take only last digit if pasted multiple
    setOtp(newOtp)
    setError('')

    // Move focus to next input
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp]
      if (otp[index]) {
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        inputRefs.current[index - 1].focus()
        newOtp[index - 1] = ''
        setOtp(newOtp)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => { newOtp[i] = char })
    setOtp(newOtp)
    setError('')
    // Focus last filled or last input
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIndex].focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const enteredOtp = otp.join('')
    if (enteredOtp.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
    try {
      setLoading(true)
      await apiVerifyOtp({ email, otp: enteredOtp })
      showSuccess('Email verified successfully!')
      if (isReset) {
        navigate('/reset-password', { state: { email } })
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.message)
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    try {
      await apiResendOtp({ email })
      showSuccess('OTP resent to your email!')
    } catch (err) {
      showError(err.message)
    }
    setOtp(Array(OTP_LENGTH).fill(''))
    setError('')
    setTimer(RESEND_COUNTDOWN)
    setCanResend(false)
    inputRefs.current[0].focus()
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Verify your email</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isReset ? 'Enter the OTP sent to reset your password.' : 'Enter the OTP sent to verify your account.'}
          </p>
          <p className="text-indigo-600 font-medium text-sm mt-1">{email}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* OTP Input Boxes */}
          <div className="flex justify-between gap-2 mb-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-semibold rounded-lg border outline-none transition focus:ring-2 focus:ring-indigo-400 ${
                  error
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : digit
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-800 focus:border-indigo-400'
                }`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
          )}

          {/* Resend */}
          <div className="text-center mb-6 mt-3">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition cursor-pointer"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                Resend OTP in{' '}
                <span className="text-indigo-600 font-medium">{timer}s</span>
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition text-sm cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
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

export default OtpVerification
