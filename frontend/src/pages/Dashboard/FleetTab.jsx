import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'

function FleetTab({ onProfileClick }) {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState(null)
  const [form, setForm] = useState({
    registration_number: '', vehicle_name: '', vehicle_type: '',
    max_capacity: '', acquisition_cost: '', odometer: '', status: 'available'
  })

  const fetchVehicles = () => {
    setLoading(true)
    api.get('/vehicles')
      .then(setVehicles)
      .catch(e => showError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchVehicles() }, [])

  const resetForm = () => setForm({
    registration_number: '', vehicle_name: '', vehicle_type: '',
    max_capacity: '', acquisition_cost: '', odometer: '', status: 'available'
  })

  const openAdd = () => { resetForm(); setEditVehicle(null); setIsAddOpen(true) }
  const openEdit = (v) => {
    setForm({
      registration_number: v.registration_number,
      vehicle_name: v.vehicle_name,
      vehicle_type: v.vehicle_type,
      max_capacity: v.max_capacity,
      acquisition_cost: v.acquisition_cost,
      odometer: v.odometer,
      status: v.status,
    })
    setEditVehicle(v)
    setIsAddOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      ...form,
      max_capacity: parseFloat(form.max_capacity),
      acquisition_cost: parseFloat(form.acquisition_cost),
      odometer: parseFloat(form.odometer) || 0,
    }
    try {
      if (editVehicle) {
        await api.put(`/vehicles/${editVehicle.id}`, body)
        showSuccess('Vehicle updated successfully.')
      } else {
        await api.post('/vehicles', body)
        showSuccess('Vehicle added successfully.')
      }
      setIsAddOpen(false)
      fetchVehicles()
    } catch (e) {
      showError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return
    try {
      await api.delete(`/vehicles/${id}`)
      showSuccess('Vehicle deleted.')
      fetchVehicles()
    } catch (e) {
      showError(e.message)
    }
  }

  const handleExport = () => {
    const headers = 'ID,Registration,Name,Type,Max Capacity,Odometer,Status\n'
    const rows = vehicles.map(v =>
      `${v.id},${v.registration_number},${v.vehicle_name},${v.vehicle_type},${v.max_capacity},${v.odometer},${v.status}`
    ).join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows))
    link.setAttribute('download', 'vehicle_registry.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (val) => {
    switch (val) {
      case 'available':  return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'on_trip':    return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'in_shop':    return 'bg-rose-50 text-rose-600 border border-rose-100'
      default:           return 'bg-slate-100 text-slate-500'
    }
  }

  const getStatusLabel = (val) => {
    switch (val) {
      case 'available': return 'Available'
      case 'on_trip':   return 'On Trip'
      case 'in_shop':   return 'In Shop'
      default:          return val
    }
  }

  const filteredVehicles = vehicles.filter(v => {
    const q = searchQuery.toLowerCase()
    const matchSearch =
      v.registration_number?.toLowerCase().includes(q) ||
      v.vehicle_name?.toLowerCase().includes(q) ||
      v.vehicle_type?.toLowerCase().includes(q)
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Available' && v.status === 'available') ||
      (statusFilter === 'On Trip' && v.status === 'on_trip') ||
      (statusFilter === 'Maintenance' && v.status === 'in_shop')
    return matchSearch && matchStatus
  })

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
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition duration-200"
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
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Vehicle Registry</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{vehicles.length} vehicles registered</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="bg-slate-100 hover:bg-slate-250 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Export</span>
          </button>
          <button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2.5 mb-6 text-left">
        {['All', 'Available', 'On Trip', 'Maintenance'].map(filter => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${statusFilter === filter ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-left flex-1 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm font-medium">Loading vehicles...</div>
        ) : (
          <table className="w-full text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                <th className="py-3 px-2 text-left">Registration</th>
                <th className="py-3 px-2 text-left">Name</th>
                <th className="py-3 px-2 text-left">Type</th>
                <th className="py-3 px-2 text-left">Status</th>
                <th className="py-3 px-2 text-left">Max Capacity</th>
                <th className="py-3 px-2 text-left">Odometer</th>
                <th className="py-3 px-2 text-left">Acq. Cost</th>
                <th className="py-3 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/65">
              {filteredVehicles.length > 0 ? filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition duration-150">
                  <td className="py-4 px-2 font-bold text-slate-800">{v.registration_number}</td>
                  <td className="py-4 px-2 font-semibold text-slate-700">{v.vehicle_name}</td>
                  <td className="py-4 px-2 text-slate-500 font-medium">{v.vehicle_type}</td>
                  <td className="py-4 px-2">
                    <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${getStatusBadge(v.status)}`}>
                      {getStatusLabel(v.status)}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-medium">{v.max_capacity} kg</td>
                  <td className="py-4 px-2 font-medium">{v.odometer} km</td>
                  <td className="py-4 px-2 font-bold text-slate-700">₹{v.acquisition_cost?.toLocaleString()}</td>
                  <td className="py-4 px-2">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(v)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(v.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-slate-400 font-medium">No matching vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">{editVehicle ? 'Edit Vehicle' : 'Add Registered Vehicle'}</h3>
              <button onClick={() => setIsAddOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {[
                { label: 'Registration Number', key: 'registration_number', placeholder: 'e.g. GJ-01-AB-1234' },
                { label: 'Vehicle Name', key: 'vehicle_name', placeholder: 'e.g. Ford Transit' },
                { label: 'Vehicle Type', key: 'vehicle_type', placeholder: 'e.g. Truck, Van, Bus' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                  <input
                    type="text" required placeholder={placeholder} value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Max Capacity (kg)', key: 'max_capacity', type: 'number' },
                  { label: 'Acquisition Cost', key: 'acquisition_cost', type: 'number' },
                  { label: 'Odometer (km)', key: 'odometer', type: 'number' },
                ].map(({ label, key, type }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                    <input
                      type={type} placeholder="0" value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none cursor-pointer">
                    <option value="available">Available</option>
                    <option value="on_trip">On Trip</option>
                    <option value="in_shop">In Shop</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition mt-6 cursor-pointer shadow-lg shadow-indigo-600/10">
                {editVehicle ? 'Update Vehicle' : 'Register Vehicle'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FleetTab
