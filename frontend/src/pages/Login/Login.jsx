import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError, showWarning } from "../../components/Toast/ToastProvider";
import { apiLogin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [errors, setErrors] = useState({ email: "", password: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (!formData.role) newErrors.role = "Role is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError("Please fix the errors before submitting.");
      return;
    }
    try {
      setLoading(true);
      const data = await apiLogin({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      login(data);
      showSuccess("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.message;
      if (msg === 'Email not found.') showError('Email not found. Please check your email or sign up.');
      else if (msg === 'Wrong password.') showWarning('Wrong password. Please try again.');
      else if (msg === 'Email not verified. Please verify your OTP.') showWarning(msg);
      else showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left panel: Full Screen Image */}
      <div
        className="hidden lg:block lg:w-3/5 bg-cover bg-center"
        style={{ backgroundImage: `url('/logo.png')` }}
      />

      {/* Right panel: Login Flow */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl lg:shadow-none p-8 lg:p-0">
          {/* Header */}


          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            {/* Email Field */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                placeholder="name@company.com"
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 ${errors.email
                    ? "border-red-400 bg-red-50 focus:ring-red-400"
                    : "border-gray-200 bg-white focus:border-indigo-400"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 ${errors.password
                      ? "border-red-400 bg-red-50 focus:ring-red-400"
                      : "border-gray-200 bg-white focus:border-indigo-400"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Role (RBAC) Field */}
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"
              >
                Role (RBAC)
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-indigo-400 ${errors.role
                    ? "border-red-400 bg-red-50 focus:ring-red-400"
                    : "border-gray-200 bg-white focus:border-indigo-400"
                  }`}
              >
                <option value="">Select your role</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition text-sm cursor-pointer disabled:opacity-60 shadow-md hover:shadow-indigo-200"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
