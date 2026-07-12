import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function SettingsTab({ onProfileClick }) {
  const { user } = useAuth()
  // General form states
  const [depotName, setDepotName] = useState('Gandhinagar Depot GJV')
  const [currency, setCurrency] = useState('INR (Rs)')
  const [distanceUnit, setDistanceUnit] = useState('Kilometers')

  const handleSave = (e) => {
    e.preventDefault()
    alert('General settings updated successfully!')
  }

  return (
    <div className="flex flex-col h-full text-left text-slate-800">
      
      {/* Top Search Bar Row */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search settings..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>

        {/* User profile detail bar */}
        <div
          onClick={onProfileClick}
          className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition duration-150"
        >
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 capitalize">
            {user?.role?.replace(/_/g, ' ')}
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Header and Title */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Settings &amp; RBAC</h2>
      </div>

      {/* Main Grid: General Left, RBAC Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Side: General config (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">General</h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            {/* Depot Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Depot Name</label>
              <input
                type="text"
                required
                value={depotName}
                onChange={(e) => setDepotName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Currency */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Currency</label>
              <input
                type="text"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Distance Unit */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Distance Unit</label>
              <input
                type="text"
                required
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-sky-500/10"
              >
                Save changes
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Role-Based Access Control (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Role-Based Access (RBAC)</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="py-3 px-2 text-left">Role</th>
                  <th className="py-3 px-2 text-center">Fleet</th>
                  <th className="py-3 px-2 text-center">Drivers</th>
                  <th className="py-3 px-2 text-center">Trips</th>
                  <th className="py-3 px-2 text-center">Fuel/Exp.</th>
                  <th className="py-3 px-2 text-center">Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/65 font-medium text-slate-700">
                {[
                  { role: 'Fleet Manager',     fleet: '✓',    drivers: '✓',    trips: '✓',    fuel: '✓',    analytics: '✓' },
                  { role: 'Driver',            fleet: '—',    drivers: '—',    trips: 'Own',  fuel: 'Own',  analytics: '—' },
                  { role: 'Safety Officer',    fleet: '—',    drivers: 'View', trips: 'View', fuel: '—',    analytics: '—' },
                  { role: 'Financial Analyst', fleet: '—',    drivers: '—',    trips: '—',    fuel: 'View', analytics: '✓' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition duration-150">
                    <td className="py-4 px-2 font-bold text-slate-800">{row.role}</td>
                    <td className="py-4 px-2 text-center font-bold text-slate-500">{row.fleet}</td>
                    <td className="py-4 px-2 text-center font-bold text-slate-500">{row.drivers}</td>
                    <td className="py-4 px-2 text-center font-bold text-slate-500">{row.trips}</td>
                    <td className="py-4 px-2 text-center font-bold text-slate-500">{row.fuel}</td>
                    <td className="py-4 px-2 text-center font-bold text-slate-500">{row.analytics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}

export default SettingsTab
