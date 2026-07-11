function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { box: 'w-7 h-7', icon: 'w-3.5 h-3.5', text: 'text-base' },
    md: { box: 'w-9 h-9', icon: 'w-4.5 h-4.5', text: 'text-lg' },
    lg: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-2xl' },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <div className={`${s.box} bg-indigo-600 rounded-lg flex items-center justify-center shrink-0`}>
        <svg className={`${s.icon} text-white`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>
      {showText && (
        <span className={`${s.text} font-bold text-indigo-600`}>MyApp</span>
      )}
    </div>
  )
}

export default Logo
