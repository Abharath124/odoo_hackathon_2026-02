import { useNavigate } from 'react-router-dom'
import { showSuccess } from './Toast/ToastProvider'
import { useAuth } from '../context/AuthContext'
import brandLogo from '../assets/brand_logo.png'

// ── Icons ────────────────────────────────────────────────────
const icons = {
  Dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 14a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
    </svg>
  ),
  Fleet: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.32-5.126c-.035-.563-.506-.998-1.07-1.002H18.75m-6.75 6.75H12V3.75h6.75a.75.75 0 01.75.75v13.5H12z" />
    </svg>
  ),
  Drivers: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Trips: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-3.46c.866-.526 1.497-1.442 1.497-2.54 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.098.63 2.014 1.497 2.54M9 15h6M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5A1.125 1.125 0 0020.625 3.75H3.375a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  'My Trips': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-3.46c.866-.526 1.497-1.442 1.497-2.54 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.098.63 2.014 1.497 2.54M9 15h6M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5A1.125 1.125 0 0020.625 3.75H3.375a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  Maintenance: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83m-3.75 3.75a2.25 2.25 0 113.75-3.75M9 6c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 0v10m-3-7v4m0 0a2 2 0 104 0V9m-4 4v2.5M6 18c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm0 0h12" />
    </svg>
  ),
  'Fuel & Expenses': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75-3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V14" />
    </svg>
  ),
  'Fuel Log': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Analytics: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
  ),
  Reports: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  Compliance: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  'AI Copilot': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  Settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Profile: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
}

// ── Role nav configs ─────────────────────────────────────────
const NAV_BY_ROLE = {
  fleet_manager: [
    'Dashboard', 'Fleet', 'Drivers', 'Trips', 'Maintenance',
    'Fuel & Expenses', 'Analytics', 'Users', 'Settings', 'Profile',
  ],
  driver: [
    'Dashboard', 'My Trips', 'Fuel Log', 'Profile',
  ],
  safety_officer: [
    'Dashboard', 'Drivers', 'Compliance', 'Profile',
  ],
  financial_analyst: [
    'Dashboard', 'Fuel & Expenses', 'Analytics', 'Reports', 'Profile',
  ],
}

// ── Role display labels & badge colors ───────────────────────
const ROLE_META = {
  fleet_manager:    { label: 'Fleet Manager',     badge: 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30' },
  driver:           { label: 'Driver',             badge: 'bg-blue-500/20 text-blue-200 border border-blue-400/30' },
  safety_officer:   { label: 'Safety Officer',     badge: 'bg-amber-500/20 text-amber-200 border border-amber-400/30' },
  financial_analyst:{ label: 'Fin. Analyst',    badge: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' },
}

// ── Initials helper ──────────────────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

// ── Sidebar ──────────────────────────────────────────────────
function Sidebar({ activeNav, onNavClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const role = user?.role || 'fleet_manager'
  const navLabels = NAV_BY_ROLE[role] || NAV_BY_ROLE.fleet_manager
  const meta = ROLE_META[role] || ROLE_META.fleet_manager

  const handleLogout = () => {
    logout()
    showSuccess('Logged out successfully!')
    navigate('/login')
  }

  return (
    <aside className="w-72 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between text-white shadow-2xl shrink-0 h-screen overflow-hidden">
      <div className="flex flex-col min-h-0 flex-1 overflow-y-auto no-scrollbar" style={{scrollbarWidth:'none',msOverflowStyle:'none'}}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-3">
          <img src={brandLogo} alt="TransitOps Logo" className="w-8 h-8 object-contain shrink-0" />
          <span className="text-xl font-bold tracking-wide text-white">TransitOps</span>
        </div>

        {/* User Card */}
        <div className="bg-black/20 hover:bg-black/30 transition border border-white/5 rounded-2xl p-3 flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white border border-white/10 shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="text-left min-w-0">
              <h4 className="text-sm font-semibold leading-tight text-white truncate">{user?.name || '—'}</h4>
              <p className="text-xs text-white/50 truncate">{user?.email || '—'}</p>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-lg shrink-0 ml-1 max-w-[80px] truncate ${meta.badge}`}>
            {meta.label}
          </span>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1 mt-8">
          {navLabels.map((label) => (
            <button
              key={label}
              onClick={() => onNavClick(label)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeNav === label
                  ? 'bg-white/15 border border-white/10 text-white shadow-lg shadow-black/5'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`transition-transform duration-200 ${activeNav === label ? 'scale-110 text-indigo-300' : 'text-white/60'}`}>
                {icons[label]}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
