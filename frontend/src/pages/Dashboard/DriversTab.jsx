import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const initialDrivers = [
  { name: 'Alex', license_number: 'DL-88213', category: 'LMV', license_expiry: '12/2028', contact: '98765xxxxx', trip_completion: '96%', safety: 'Available', status: 'Available' },
  { name: 'John', license_number: 'DL-41120', category: 'HGV', license_expiry: '03/2025 EXPIRED', contact: '98220xxxxx', trip_completion: '87%', safety: 'Suspended', status: 'Suspended' },
  { name: 'Priya', license_number: 'DL-77031', category: 'LMV', license_expiry: '09/2027', contact: '99110xxxxx', trip_completion: '99%', safety: 'On Trip', status: 'On Trip' },
  { name: 'Suresh', license_number: 'DL-90045', category: 'HGV', license_expiry: '01/2027', contact: '97440xxxxx', trip_completion: '88%', safety: 'Available', status: 'Off Duty' },
]

function DriversTab({ onProfileClick, readOnly = false }) {
  const { user } = useAuth()
  const [drivers, setDrivers] = useState(initialDrivers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(null)

  // Add Driver Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLicense, setNewLicense] = useState('')
  const [newCategory, setNewCategory] = useState('LMV')
  const [newExpiry, setNewExpiry] = useState('')
  const [newContact, setNewContact] = useState('')
  const [newTripComp, setNewTripComp] = useState('')
  const [newSafety, setNewSafety] = useState('Available')
  const [newStatus, setNewStatus] = useState('Available')

  // Filtered drivers based on Search bar
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.license_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.contact.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle status handler for the selected driver
  const handleToggleStatus = (statusValue) => {
    if (selectedDriverIndex === null) {
      alert("Please select a driver from the table first by clicking on a row!")
      return
    }
    const updated = [...drivers]
    updated[selectedDriverIndex].status = statusValue
    
    // Also toggle safety score/indicator context based on status for consistency
    if (statusValue === 'Suspended') {
      updated[selectedDriverIndex].safety = 'Suspended'
    } else if (statusValue === 'On Trip') {
      updated[selectedDriverIndex].safety = 'On Trip'
    } else if (statusValue === 'Available') {
      updated[selectedDriverIndex].safety = 'Available'
    }
    
    setDrivers(updated)
  }

  // Handle create driver
  const handleCreateDriver = (e) => {
    e.preventDefault()
    if (!newName || !newLicense || !newExpiry || !newContact || !newTripComp) {
      alert("All fields are required.")
      return
    }

    const newDriver = {
      name: newName,
      license_number: newLicense,
      category: newCategory,
      license_expiry: newExpiry,
      contact: newContact,
      trip_completion: newTripComp.endsWith('%') ? newTripComp : `${newTripComp}%`,
      safety: newSafety,
      status: newStatus
    }

    setDrivers([...drivers, newDriver])
    setIsModalOpen(false)

    // Reset Form
    setNewName('')
    setNewLicense('')
    setNewCategory('LMV')
    setNewExpiry('')
    setNewContact('')
    setNewTripComp('')
    setNewSafety('Available')
    setNewStatus('Available')
  }

  // Helpers for pill styling
  const getSafetyBadge = (val) => {
    switch (val) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'Suspended':
        return 'bg-orange-50 text-orange-600 border border-orange-100'
      case 'On Trip':
        return 'bg-blue-50 text-blue-600 border border-blue-100'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const getStatusBadge = (val) => {
    switch (val) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'Suspended':
        return 'bg-orange-50 text-orange-600 border border-orange-100'
      case 'On Trip':
        return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'Off Duty':
        return 'bg-slate-100 text-slate-500 border border-slate-200'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

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
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>

        {/* User profile details badge */}
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

      {/* Header and Add Driver Button Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Drivers & Safety Profiles</h2>
        {!readOnly && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Driver</span>
          </button>
        )}
      </div>

      {/* Drivers Registry Table */}
      <div className="overflow-x-auto text-left flex-1 min-h-[300px]">
        <table className="w-full text-sm text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <th className="py-3 px-2 text-left">Driver</th>
              <th className="py-3 px-2 text-left">License No.</th>
              <th className="py-3 px-2 text-left">Category</th>
              <th className="py-3 px-2 text-left">Expiry</th>
              <th className="py-3 px-2 text-left">Contact</th>
              <th className="py-3 px-2 text-left">Trip Compl.</th>
              <th className="py-3 px-2 text-left">Safety</th>
              <th className="py-3 px-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/65">
            {filteredDrivers.map((driver, idx) => {
              const actualIndex = drivers.findIndex(d => d.license_number === driver.license_number)
              const isSelected = selectedDriverIndex === actualIndex
              const isExpired = driver.license_expiry.includes("EXPIRED")

              return (
                <tr 
                  key={driver.license_number} 
                  onClick={() => setSelectedDriverIndex(isSelected ? null : actualIndex)}
                  className={`cursor-pointer transition duration-150 ${isSelected ? 'bg-indigo-50/60 hover:bg-indigo-50' : 'hover:bg-slate-50'}`}
                >
                  <td className="py-3.5 px-2 font-bold text-slate-800">{driver.name}</td>
                  <td className="py-3.5 px-2 font-semibold">{driver.license_number}</td>
                  <td className="py-3.5 px-2">{driver.category}</td>
                  <td className="py-3.5 px-2">
                    <span className={isExpired ? 'text-rose-500 font-bold text-xs uppercase' : 'font-medium'}>
                      {driver.license_expiry}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 font-medium">{driver.contact}</td>
                  <td className="py-3.5 px-2 font-medium">{driver.trip_completion}</td>
                  <td className="py-3.5 px-2">
                    <span className={`inline-block w-24 text-center py-1.5 rounded-lg text-xs font-bold ${getSafetyBadge(driver.safety)}`}>
                      {driver.safety}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className={`inline-block w-24 text-center py-1.5 rounded-lg text-xs font-bold ${getStatusBadge(driver.status)}`}>
                      {driver.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Toggle Status Panel — fleet_manager only */}
      {!readOnly && (
        <div className="mt-6 bg-slate-50/60 border border-slate-100 rounded-2xl p-5 text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Toggle Status</h3>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => handleToggleStatus('Available')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-emerald-500/10">Available</button>
            <button onClick={() => handleToggleStatus('On Trip')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-blue-500/10">On Trip</button>
            <button onClick={() => handleToggleStatus('Off Duty')} className="bg-slate-500 hover:bg-slate-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-slate-500/10">Off Duty</button>
            <button onClick={() => handleToggleStatus('Suspended')} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-orange-500/10">Suspended</button>
          </div>
        </div>
      )}

      {/* readOnly info notice for safety_officer */}
      {readOnly && (
        <div className="mt-6 bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-xs font-semibold text-amber-600 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View only — use the Compliance tab to suspend drivers or renew licenses.
        </div>
      )}

      {/* Bottom Business Rule Notice */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-left text-xs font-semibold text-amber-600/90 tracking-wide flex items-center gap-1.5">
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Rule: Expired license or Suspended status &#8594; blocked from trip assignment</span>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Add New Driver</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="space-y-4 text-left">
              {/* Driver Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Driver Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* License Number */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">License No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-88213"
                  value={newLicense}
                  onChange={(e) => setNewLicense(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                  >
                    <option value="LMV">LMV</option>
                    <option value="HGV">HGV</option>
                  </select>
                </div>

                {/* Expiry */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12/2028"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Contact */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 98765xxxxx"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {/* Trip Completion rate */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trip Compl.</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 96%"
                    value={newTripComp}
                    onChange={(e) => setNewTripComp(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Safety */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety Status</label>
                  <select
                    value={newSafety}
                    onChange={(e) => setNewSafety(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Suspended">Suspended</option>
                    <option value="On Trip">On Trip</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-755 text-white font-bold py-3 rounded-xl text-sm transition mt-6 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                Create Driver
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default DriversTab
