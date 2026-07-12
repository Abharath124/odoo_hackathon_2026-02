import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import DashboardTab from './DashboardTab'
import FleetTab from './FleetTab'
import DriversTab from './DriversTab'
import TripsTab from './TripsTab'
import MaintenanceTab from './MaintenanceTab'
import FuelExpensesTab from './FuelExpensesTab'
import AnalyticsTab from './AnalyticsTab'
import UsersTab from './UsersTab'
import SettingsTab from './SettingsTab'
import ProfileTab from './ProfileTab'
import MyTripsTab from './MyTripsTab'
import DriverFuelLogTab from './DriverFuelLogTab'
import ComplianceTab from './ComplianceTab'

// ── Default landing tab per role ─────────────────────────────
const ROLE_DEFAULT_TAB = {
  fleet_manager:    'Dashboard',
  driver:           'My Trips',
  safety_officer:   'Dashboard',
  financial_analyst:'Dashboard',
}

// ── Allowed tabs per role ────────────────────────────────────
const ROLE_ALLOWED_TABS = {
  fleet_manager: [
    'Dashboard', 'Fleet', 'Drivers', 'Trips', 'Maintenance',
    'Fuel & Expenses', 'Analytics', 'Users', 'AI Copilot', 'Settings', 'Profile',
  ],
  driver: [
    'Dashboard', 'My Trips', 'Fuel Log', 'AI Copilot', 'Profile',
  ],
  safety_officer: [
    'Dashboard', 'Drivers', 'Compliance', 'AI Copilot', 'Profile',
  ],
  financial_analyst: [
    'Dashboard', 'Fuel & Expenses', 'Analytics', 'Reports', 'AI Copilot', 'Profile',
  ],
}

function Dashboard() {
  const { user } = useAuth()
  const location = useLocation()

  const role = user?.role || 'fleet_manager'
  const defaultTab = location.state?.defaultTab || ROLE_DEFAULT_TAB[role]
  const [activeNav, setActiveNav] = useState(defaultTab)

  // Role-gated nav click — silently block tabs not in allowed list
  const handleNavClick = (label) => {
    const allowed = ROLE_ALLOWED_TABS[role] || []
    if (allowed.includes(label)) {
      setActiveNav(label)
    }
  }

  const renderContent = () => {
    const toProfile = () => setActiveNav('Profile')

    // ── fleet_manager tabs ───────────────────────────────────
    if (role === 'fleet_manager') {
      switch (activeNav) {
        case 'Dashboard':       return <DashboardTab onProfileClick={toProfile} />
        case 'Fleet':           return <FleetTab onProfileClick={toProfile} />
        case 'Drivers':         return <DriversTab onProfileClick={toProfile} />
        case 'Trips':           return <TripsTab onProfileClick={toProfile} />
        case 'Maintenance':     return <MaintenanceTab onProfileClick={toProfile} />
        case 'Fuel & Expenses': return <FuelExpensesTab onProfileClick={toProfile} />
        case 'Analytics':       return <AnalyticsTab onProfileClick={toProfile} />
        case 'Users':           return <UsersTab onProfileClick={toProfile} />
        case 'Settings':        return <SettingsTab onProfileClick={toProfile} />
        case 'Profile':         return <ProfileTab />
        case 'AI Copilot':      return <ComingSoon label="AI Copilot" />
        default:                return <ComingSoon label={activeNav} />
      }
    }

    // ── driver tabs ──────────────────────────────────────────
    if (role === 'driver') {
      switch (activeNav) {
        case 'Dashboard':  return <DashboardTab onProfileClick={toProfile} />
        case 'My Trips':   return <MyTripsTab onProfileClick={toProfile} />
        case 'Fuel Log':   return <DriverFuelLogTab onProfileClick={toProfile} />
        case 'AI Copilot': return <ComingSoon label="AI Copilot" />
        case 'Profile':    return <ProfileTab />
        default:           return <Unauthorized />
      }
    }

    // ── safety_officer tabs ──────────────────────────────────
    if (role === 'safety_officer') {
      switch (activeNav) {
        case 'Dashboard':  return <DashboardTab onProfileClick={toProfile} />
        case 'Drivers':    return <DriversTab onProfileClick={toProfile} readOnly />
        case 'Compliance': return <ComplianceTab onProfileClick={toProfile} />
        case 'AI Copilot': return <ComingSoon label="AI Copilot" />
        case 'Profile':    return <ProfileTab />
        default:           return <Unauthorized />
      }
    }

    // ── financial_analyst tabs ───────────────────────────────
    if (role === 'financial_analyst') {
      switch (activeNav) {
        case 'Dashboard':       return <DashboardTab onProfileClick={toProfile} />
        case 'Fuel & Expenses': return <FuelExpensesTab onProfileClick={toProfile} />
        case 'Analytics':       return <AnalyticsTab onProfileClick={toProfile} />
        case 'Reports':         return <ComingSoon label="Reports" />
        case 'AI Copilot':      return <ComingSoon label="AI Copilot" />
        case 'Profile':         return <ProfileTab />
        default:                return <Unauthorized />
      }
    }

    return <Unauthorized />
  }

  return (
    <div className="h-screen max-h-screen bg-mesh-gradient p-6 flex gap-6 overflow-hidden">
      <Sidebar activeNav={activeNav} onNavClick={handleNavClick} />
      <div className="flex-1 bg-white rounded-[32px] p-8 shadow-2xl overflow-y-auto flex flex-col border border-white/80 text-slate-800 relative">
        {renderContent()}
      </div>
    </div>
  )
}

// ── Placeholder for Part 4 tabs ──────────────────────────────
function ComingSoon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
        <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-slate-700 font-bold text-sm">{label}</p>
      <p className="text-slate-400 text-xs font-medium">Coming in Part 4</p>
    </div>
  )
}

// ── Unauthorized access fallback ─────────────────────────────
function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
        <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-slate-700 font-bold text-sm">Access Denied</p>
      <p className="text-slate-400 text-xs font-medium">You don't have permission to view this page</p>
    </div>
  )
}

export default Dashboard
