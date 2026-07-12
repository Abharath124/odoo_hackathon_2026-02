import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function DashboardTab({ onProfileClick }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [myTrips, setMyTrips] = useState([])
  const [drivers, setDrivers] = useState([])
  const [costReport, setCostReport] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const role = user?.role
    const fetches = [api.get('/dashboard/stats').catch(() => null)]

    if (role === 'driver') fetches.push(api.get('/trips/my').catch(() => []))
    if (role === 'safety_officer') fetches.push(api.get('/drivers').catch(() => []))
    if (role === 'financial_analyst') fetches.push(api.get('/reports/operational-cost').catch(() => []))

    Promise.all(fetches).then(([s, extra]) => {
      if (s) setStats(s)
      if (role === 'driver' && extra) setMyTrips(extra)
      if (role === 'safety_officer' && extra) setDrivers(extra)
      if (role === 'financial_analyst' && extra) setCostReport(extra)
      setLoading(false)
    })
  }, [user?.role])

  const role = user?.role

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="flex flex-col text-left text-slate-800">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input type="text" placeholder="Search anything..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 capitalize">
            {user?.role?.replace(/_/g, ' ')}
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Good morning, {user?.name?.split(' ')[0]} 👏</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Here's your overview.
        </p>
      </div>

      {/* ── FLEET MANAGER ── */}
      {role === 'fleet_manager' && <FleetManagerDashboard stats={stats} />}

      {/* ── DRIVER ── */}
      {role === 'driver' && <DriverDashboard trips={myTrips} />}

      {/* ── SAFETY OFFICER ── */}
      {role === 'safety_officer' && <SafetyDashboard stats={stats} drivers={drivers} />}

      {/* ── FINANCIAL ANALYST ── */}
      {role === 'financial_analyst' && <FinancialDashboard stats={stats} costReport={costReport} />}

    </div>
  )
}

// ── Fleet Manager Dashboard ──────────────────────────────────
function FleetManagerDashboard({ stats }) {
  const cards = [
    { val: stats?.totalVehicles ?? '—',    desc: 'Total Vehicles',    color: '#3b82f6' },
    { val: stats?.availableVehicles ?? '—', desc: 'Available Now',    color: '#10b981' },
    { val: stats?.vehiclesInShop ?? '—',   desc: 'In Maintenance',   color: '#f59e0b' },
    { val: stats?.activeTrips ?? '—',      desc: 'Active Trips',     color: '#8b5cf6' },
    { val: stats?.totalDrivers ?? '—',     desc: 'Total Drivers',    color: '#6366f1' },
    { val: stats?.availableDrivers ?? '—', desc: 'Drivers Available',color: '#d97706' },
    { val: stats?.pendingTrips ?? '—',     desc: 'Pending Trips',    color: '#10b981' },
    { val: stats?.completedTrips ?? '—',   desc: 'Completed Trips',  color: '#ef4444' },
  ]

  return (
    <>
      {/* Fleet Health + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Radial */}
        <div className="lg:col-span-4 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Fleet Utilization</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Vehicles currently on trip</p>
          </div>
          <div className="flex justify-center items-center my-6 relative">
            <svg className="w-32 h-32" viewBox="0 0 36 36">
              <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500" strokeDasharray={`${stats ? stats.fleetUtilization.toFixed(0) : 0}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-800">{stats ? stats.fleetUtilization.toFixed(0) : '—'}</span>
              <span className="text-[9px] font-bold text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
            <div>
              <span className="text-xs font-bold text-emerald-600 block">{stats?.availableVehicles ?? '—'}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Available</span>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-500 block">{stats?.vehiclesOnTrip ?? '—'}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">On Trip</span>
            </div>
            <div>
              <span className="text-xs font-bold text-rose-500 block">{stats?.vehiclesInShop ?? '—'}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">In Shop</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.desc}</span>
              <span className="text-xl font-black text-slate-800 tracking-tight my-2">{card.val}</span>
              <svg className="w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path d={`M 0,20 Q 25,${5 + (idx % 3) * 6} 50,15 T 100,${10 + (idx % 2) * 5}`}
                  fill="none" stroke={card.color} strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Status Summary */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Pending Trips', val: stats?.pendingTrips ?? '—', color: 'border-l-amber-500 bg-amber-50/40', text: 'text-amber-600' },
          { label: 'Active Trips', val: stats?.activeTrips ?? '—', color: 'border-l-blue-500 bg-blue-50/40', text: 'text-blue-600' },
          { label: 'Completed Trips', val: stats?.completedTrips ?? '—', color: 'border-l-emerald-500 bg-emerald-50/40', text: 'text-emerald-600' },
        ].map((item, idx) => (
          <div key={idx} className={`border-l-4 ${item.color} rounded-2xl p-5 border border-slate-100 shadow-sm`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
            <p className={`text-3xl font-black ${item.text}`}>{item.val}</p>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Driver Dashboard ─────────────────────────────────────────
function DriverDashboard({ trips }) {
  const pending = trips.filter(t => t.status === 'pending').length
  const active = trips.filter(t => t.status === 'active').length
  const completed = trips.filter(t => t.status === 'completed').length

  const statusBadge = (s) => {
    if (s === 'active') return 'bg-blue-50 text-blue-600 border border-blue-100'
    if (s === 'pending') return 'bg-amber-50 text-amber-600 border border-amber-100'
    return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  }

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Pending', val: pending, color: 'border-l-amber-500 bg-amber-50/40', text: 'text-amber-600' },
          { label: 'Active', val: active, color: 'border-l-blue-500 bg-blue-50/40', text: 'text-blue-600' },
          { label: 'Completed', val: completed, color: 'border-l-emerald-500 bg-emerald-50/40', text: 'text-emerald-600' },
        ].map((item, idx) => (
          <div key={idx} className={`border-l-4 ${item.color} rounded-2xl p-5 border border-slate-100 shadow-sm`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label} Trips</p>
            <p className={`text-3xl font-black ${item.text}`}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* Recent trips */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4">My Recent Trips</h3>
        {trips.length === 0 ? (
          <p className="text-slate-400 text-sm font-medium py-4 text-center">No trips assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {trips.slice(0, 5).map(trip => (
              <div key={trip.id} className="flex items-center justify-between border-b border-slate-100/50 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="text-xs font-bold text-indigo-600 block">TRIP #{trip.id}</span>
                  <span className="text-sm font-bold text-slate-800">{trip.source} → {trip.destination}</span>
                  <span className="text-[10px] text-slate-400 font-medium block">{trip.vehicle?.vehicle_name} • {trip.distance} km</span>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${statusBadge(trip.status)}`}>
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ── Safety Officer Dashboard ─────────────────────────────────
function SafetyDashboard({ stats, drivers }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in30 = new Date(); in30.setDate(today.getDate() + 30)

  const expired = drivers.filter(d => new Date(d.license_expiry) < today).length
  const expiringSoon = drivers.filter(d => {
    const exp = new Date(d.license_expiry)
    return exp >= today && exp <= in30
  }).length
  const suspended = drivers.filter(d => d.status === 'suspended').length
  const compliant = drivers.length - expired - expiringSoon - suspended

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Drivers', val: drivers.length, color: 'border-l-indigo-500 bg-indigo-50/40', text: 'text-indigo-600' },
          { label: 'Compliant', val: compliant, color: 'border-l-emerald-500 bg-emerald-50/40', text: 'text-emerald-600' },
          { label: 'Expiring Soon', val: expiringSoon, color: 'border-l-amber-500 bg-amber-50/40', text: 'text-amber-600' },
          { label: 'Expired / Suspended', val: expired + suspended, color: 'border-l-rose-500 bg-rose-50/40', text: 'text-rose-600' },
        ].map((item, idx) => (
          <div key={idx} className={`border-l-4 ${item.color} rounded-2xl p-5 border border-slate-100 shadow-sm`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
            <p className={`text-3xl font-black ${item.text}`}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4">Driver Compliance Overview</h3>
        {drivers.length === 0 ? (
          <p className="text-slate-400 text-sm font-medium py-4 text-center">No driver records found.</p>
        ) : (
          <div className="space-y-3">
            {drivers.slice(0, 6).map(driver => {
              const exp = new Date(driver.license_expiry)
              const isExpired = exp < today
              const isSoon = exp >= today && exp <= in30
              const isSuspended = driver.status === 'suspended'
              const alertColor = isSuspended || isExpired ? 'text-rose-600' : isSoon ? 'text-amber-600' : 'text-emerald-600'
              const alertLabel = isSuspended ? 'Suspended' : isExpired ? 'Expired' : isSoon ? 'Expiring Soon' : 'Compliant'
              return (
                <div key={driver.id} className="flex items-center justify-between border-b border-slate-100/50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <span className="text-sm font-bold text-slate-800">{driver.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium block">{driver.license_number} • Expires {driver.license_expiry}</span>
                  </div>
                  <span className={`text-xs font-bold ${alertColor}`}>{alertLabel}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

// ── Financial Analyst Dashboard ──────────────────────────────
function FinancialDashboard({ stats, costReport }) {
  const totalCost = costReport.reduce((sum, v) => sum + (v.total_operational_cost || 0), 0)
  const totalFuel = costReport.reduce((sum, v) => sum + (v.fuel_cost || 0), 0)
  const totalMaint = costReport.reduce((sum, v) => sum + (v.maintenance_cost || 0), 0)
  const totalExp = costReport.reduce((sum, v) => sum + (v.expense_cost || 0), 0)

  const top3 = [...costReport].sort((a, b) => b.total_operational_cost - a.total_operational_cost).slice(0, 3)
  const maxCost = top3[0]?.total_operational_cost || 1

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Operational Cost', val: `₹${totalCost.toLocaleString('en-IN')}`, color: 'border-l-rose-500 bg-rose-50/40', text: 'text-rose-600' },
          { label: 'Total Fuel Cost', val: `₹${totalFuel.toLocaleString('en-IN')}`, color: 'border-l-amber-500 bg-amber-50/40', text: 'text-amber-600' },
          { label: 'Maintenance Cost', val: `₹${totalMaint.toLocaleString('en-IN')}`, color: 'border-l-blue-500 bg-blue-50/40', text: 'text-blue-600' },
          { label: 'Other Expenses', val: `₹${totalExp.toLocaleString('en-IN')}`, color: 'border-l-indigo-500 bg-indigo-50/40', text: 'text-indigo-600' },
        ].map((item, idx) => (
          <div key={idx} className={`border-l-4 ${item.color} rounded-2xl p-5 border border-slate-100 shadow-sm`}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
            <p className={`text-xl font-black ${item.text}`}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-6">Top Costliest Vehicles</h3>
        {top3.length === 0 ? (
          <p className="text-slate-400 text-sm font-medium py-4 text-center">No cost data available.</p>
        ) : (
          <div className="space-y-5">
            {top3.map((v, idx) => {
              const pct = (v.total_operational_cost / maxCost) * 100
              const colors = ['bg-rose-400', 'bg-amber-500', 'bg-blue-500']
              return (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>{v.vehicle_name} <span className="text-slate-400 font-medium">({v.registration_number})</span></span>
                    <span>₹{v.total_operational_cost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-200/60 h-3 rounded-full overflow-hidden">
                    <div className={`${colors[idx]} h-full rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default DashboardTab
