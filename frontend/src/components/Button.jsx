function Button({ children, type = 'button', onClick, loading = false, disabled = false, variant = 'primary', className = '' }) {
  const base = 'w-full font-semibold py-2.5 rounded-lg transition text-sm cursor-pointer disabled:opacity-60'
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  )
}

export default Button
