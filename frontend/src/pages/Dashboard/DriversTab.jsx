import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'

function DriversTab({ onProfileClick, readOnly = false }) {
  const { user } = useAuth()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editDriver, setEditDriver] = useState(null)
  const [form, setForm] = useState({
    name: '', license_number: '', category: 'LMV',
    license_expiry: '', contact: '', safety_score: '100', status: 'available'
  })

  const fetchDrivers = () => {
    setLoading(true)
    api.get('/drivers')
      .then(setDrivers)
      .catch(e => showError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDrivers() }, [])

  const resetForm = () => setForm({
    name: '', license_number: '', category: 'LMV',
    license_expiry: '', contact: '', safety_score: '100', status: 'available'
  })

  const openAdd = () => { resetForm(); setEditDriver(null); setIsModalOpen(true) }
  const openEdit = (d) => {
    setForm({
      name: d.name, license_number: d.license_number, category: d.category,
      license_expiry: d.license_expiry, contact: d.contact,
      safety_score: d.safety_score, status: d.status,
    })
    setEditDriver(d)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = { ...form, safety_score: parseFloat(form.safety_score) }
    try {
      if (editDriver) {
        await api.put(`/drivers/${editDriver.id}`, body)
        showSuccess('Driver updated successfully.')
      } else {
        await api.post('/drivers', body)
        showSuccess('Driver added successfully.')
      }
      setIsModalOpen(false)
      fetchDrivers()
    } catch (e) {
      showError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this driver?')) return
    try {
      await api.delete(`/drivers/${id}`)
      showSuccess('Driver deleted.')
      fetchDrivers()
    } catch (e) {
      showError(e.message)
    }
  }

  const handleToggleStatus = async (statusValue) => {
    if (!selectedDriver) {
      showError('Please select a driver from the table first.')
      return
    }
    try {
      await api.put(`/drivers/${selectedDriver.id}`, { status: statusValue })
      showSuccess(`Driver status updated to ${statusValue}.`)
      fetchDrivers()
      setSelectedDriver(null)
    } catch (e) {
      showError(e.message)
    }
  }

  const isExpired = (expiry) => expiry && new Date(expiry) < new Date()

  const getStatusBadge = (val) => {
    switch (val) {
      case 'available':  return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'suspended':  return 'bg-orange-50 text-orange-600 border border-orange-100'
      case 'on_trip':    return 'bg-blue-50 text-blue-600 border border-blue-100'
      default:           return 'bg-slate-100 text-slate-600'
    }
  }

  const getStatusLabel = (val) => {
    switch (val) {
      case 'available': return 'Available'
      case 'on_trip':   return 'On Trip'
      case 'suspended': return 'Suspended'
      default:          return val
    }
  }

  const filteredDrivers = drivers.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.license_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.contact?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Top Search Bar Row */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text" placeholder="Search..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition duration-150">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 capitalize">
            {user?.role?.replace(/_/g, ' ')}
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Drivers & Safety Profiles</h2>
        {!readOnly && (
          <button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Driver</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-left flex-1 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm font-medium">Loading drivers...</div>
        ) : (
          <table className="w-full text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                <th className="py-3 px-2 text-left">Driver</th>
                <th className="py-3 px-2 text-left">License No.</th>
                <th className="py-3 px-2 text-left">Category</th>
                <th className="py-3 px-2 text-left">Expiry</th>
                <th className="py-3 px-2 text-left">Contact</th>
                <th className="py-3 px-2 text-left">Safety Score</th>
                <th className="py-3 px-2 text-left">Status</th>
                {!readOnly && <th className="py-3 px-2 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/65">
              {filteredDrivers.map((driver) => {
                const expired = isExpired(driver.license_expiry)
                const isSelected = selectedDriver?.id === driver.id
                return (
                  <tr
                    key={driver.id}
                    onClick={() => setSelectedDriver(isSelected ? null : driver)}
                    className={`cursor-pointer transition duration-150 ${isSelected ? 'bg-indigo-50/60 hover:bg-indigo-50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-3.5 px-2 font-bold text-slate-800">{driver.name}</td>
                    <td className="py-3.5 px-2 font-semibold">{driver.license_number}</td>
                    <td className="py-3.5 px-2">{driver.category}</td>
                    <td className="py-3.5 px-2">
                      <span className={expired ? 'text-rose-500 font-bold text-xs uppercase' : 'font-medium'}>
                        {driver.license_expiry} {expired && '(EXPIRED)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-medium">{driver.contact}</td>
                    <td className="py-3.5 px-2 font-medium">{driver.safety_score}</td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-block w-24 text-center py-1.5 rounded-lg text-xs font-bold ${getStatusBadge(driver.status)}`}>
                        {getStatusLabel(driver.status)}
                      </span>
                    </td>
                    {!readOnly && (
                      <td className="py-3.5 px-2">
                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                          <button onClick={() => openEdit(driver)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(driver.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer">Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
              {filteredDrivers.length === 0 && (
                <tr><td colSpan={readOnly ? 7 : 8} className="py-6 text-center text-slate-400 font-medium">No drivers found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Toggle Status Panel */}
      {!readOnly && (
        <div className="mt-6 bg-slate-50/60 border border-slate-100 rounded-2xl p-5 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Toggle Status</h3>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => handleToggleStatus('available')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-emerald-500/10">Available</button>
            <button onClick={() => handleToggleStatus('on_trip')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-blue-500/10">On Trip</button>
            <button onClick={() => handleToggleStatus('suspended')} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-orange-500/10">Suspended</button>
          </div>
        </div>
      )}

      {/* readOnly notice */}
      {readOnly && (
        <div className="mt-6 bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-xs font-semibold text-amber-600 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View only — use the Compliance tab to suspend drivers or renew licenses.
        </div>
      )}

      {/* Business Rule Notice */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-left text-xs font-semibold text-amber-600/90 tracking-wide flex items-center gap-1.5">
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Rule: Expired license or Suspended status &#8594; blocked from trip assignment</span>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">{editDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Driver Name</label>
                <input type="text" required placeholder="e.g. Rakesh Kumar" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">License No.</label>
                <input type="text" required placeholder="e.g. DL-001" value={form.license_number}
                  onChange={e => setForm({ ...form, license_number: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none cursor-pointer">
                    <option value="LMV">LMV</option>
                    <option value="HMV">HMV</option>
                    <option value="HGV">HGV</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">License Expiry</label>
                  <input type="date" required value={form.license_expiry}
                    onChange={e => setForm({ ...form, license_expiry: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</label>
                  <input type="text" required placeholder="e.g. 9876543210" value={form.contact}
                    onChange={e => setForm({ ...form, contact: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety Score</label>
                  <input type="number" min="0" max="100" value={form.safety_score}
                    onChange={e => setForm({ ...form, safety_score: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none cursor-pointer">
                  <option value="available">Available</option>
                  <option value="on_trip">On Trip</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition mt-6 cursor-pointer shadow-lg shadow-indigo-600/10">
                {editDriver ? 'Update Driver' : 'Create Driver'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DriversTab
