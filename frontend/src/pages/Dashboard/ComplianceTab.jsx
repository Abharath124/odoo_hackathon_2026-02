import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'

const BASE = 'http://localhost:5000/api'

function ComplianceTab({ onProfileClick }) {
  const { user } = useAuth()
  const token = user?.token

  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Renew license modal
  const [renewModal, setRenewModal] = useState(null) // driver object
  const [newExpiry, setNewExpiry] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE}/drivers`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setDrivers(data)
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDrivers() }, [])

  const handleSuspend = async (driver) => {
    if (!confirm(`Suspend driver ${driver.name}?`)) return
    try {
      const res = await fetch(`${BASE}/drivers/${driver.id}/suspend`, { method: 'PATCH', headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showSuccess(`${driver.name} suspended.`)
      fetchDrivers()
    } catch (err) {
      showError(err.message)
    }
  }

  const handleRenew = async (e) => {
    e.preventDefault()
    if (!newExpiry) return
    try {
      setSubmitting(true)
      const res = await fetch(`${BASE}/drivers/${renewModal.id}/renew-license`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ license_expiry: newExpiry }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showSuccess(`License renewed for ${renewModal.name}.`)
      setRenewModal(null)
      setNewExpiry('')
      fetchDrivers()
    } catch (err) {
      showError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isExpired = (expiry) => new Date(expiry) < today

  const isExpiringSoon = (expiry) => {
    const diff = (new Date(expiry) - today) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 30
  }

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.license_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Compliance summary counts
  const expiredCount = drivers.filter(d => isExpired(d.license_expiry)).length
  const suspendedCount = drivers.filter(d => d.status === 'suspended').length
  const expiringSoonCount = drivers.filter(d => isExpiringSoon(d.license_expiry)).length

  const statusBadge = (status) => {
    switch (status) {
      case 'available':  return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'on_trip':    return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'suspended':  return 'bg-rose-50 text-rose-600 border border-rose-100'
      default:           return 'bg-slate-100 text-slate-500'
    }
  }

  const safetyColor = (score) => {
    if (score >= 85) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  return (
    <div className="flex flex-col h-full text-left text-slate-800">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text" placeholder="Search drivers..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-xs font-bold border border-amber-100">Safety Officer</span>
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-amber-500/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Compliance & Safety</h2>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Expired Licenses</span>
          <span className="text-2xl font-black text-rose-600">{expiredCount}</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Expiring in 30 days</span>
          <span className="text-2xl font-black text-amber-600">{expiringSoonCount}</span>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Suspended Drivers</span>
          <span className="text-2xl font-black text-orange-600">{suspendedCount}</span>
        </div>
      </div>

      {/* Drivers Table */}
      {loading ? (
        <div className="flex items-center justify-center flex-1 text-slate-400 text-sm font-semibold">Loading drivers...</div>
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                <th className="py-3 px-2 text-left">Driver</th>
                <th className="py-3 px-2 text-left">License No.</th>
                <th className="py-3 px-2 text-left">Category</th>
                <th className="py-3 px-2 text-left">Expiry</th>
                <th className="py-3 px-2 text-left">Safety Score</th>
                <th className="py-3 px-2 text-left">Status</th>
                <th className="py-3 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/65">
              {filtered.map(driver => {
                const expired = isExpired(driver.license_expiry)
                const expiringSoon = isExpiringSoon(driver.license_expiry)

                return (
                  <tr key={driver.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="py-3.5 px-2 font-bold text-slate-800">{driver.name}</td>
                    <td className="py-3.5 px-2 font-semibold">{driver.license_number}</td>
                    <td className="py-3.5 px-2">{driver.category}</td>
                    <td className="py-3.5 px-2">
                      <span className={`text-xs font-bold ${expired ? 'text-rose-600' : expiringSoon ? 'text-amber-600' : 'text-slate-600'}`}>
                        {driver.license_expiry}
                        {expired && <span className="ml-1 bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[10px]">EXPIRED</span>}
                        {!expired && expiringSoon && <span className="ml-1 bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded text-[10px]">SOON</span>}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <div className={`${safetyColor(driver.safety_score)} h-full rounded-full`} style={{ width: `${driver.safety_score}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{driver.safety_score}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold capitalize ${statusBadge(driver.status)}`}>
                        {driver.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setRenewModal(driver); setNewExpiry(driver.license_expiry) }}
                          className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Renew
                        </button>
                        {driver.status !== 'suspended' && (
                          <button
                            onClick={() => handleSuspend(driver)}
                            className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Business Rule Notice */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-amber-600/90 tracking-wide flex items-center gap-1.5">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Rule: Expired license or Suspended status &#8594; blocked from trip assignment</span>
      </div>

      {/* Renew License Modal */}
      {renewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Renew License</h3>
              <button onClick={() => setRenewModal(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Driver: <span className="text-slate-700 font-bold">{renewModal.name}</span> &nbsp;|&nbsp; {renewModal.license_number}
            </p>
            <form onSubmit={handleRenew} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Expiry Date</label>
                <input
                  type="date" required value={newExpiry}
                  onChange={e => setNewExpiry(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer shadow-lg shadow-indigo-600/10 disabled:opacity-60"
              >
                {submitting ? 'Renewing...' : 'Confirm Renewal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComplianceTab
