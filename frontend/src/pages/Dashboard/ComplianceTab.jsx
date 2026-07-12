import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function ComplianceTab({ onProfileClick }) {
  const { user } = useAuth()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(null)

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const data = await api.get('/drivers')
      setDrivers(data)
    } catch (err) {
      console.error(err)
      setDrivers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) {
      fetchDrivers()
    }
  }, [user])

  const handleSuspend = async () => {
    if (selectedDriverIndex === null) {
      alert("Please select a driver from the table first!")
      return
    }

    const driver = drivers[selectedDriverIndex]
    try {
      await api.patch(`/drivers/${driver.id}/suspend`)
      alert(`${driver.name} status updated successfully!`)
      fetchDrivers()
      setSelectedDriverIndex(null)
    } catch (err) {
      alert(err.message || "Failed to update driver suspension state.")
    }
  }

  const handleRenew = async () => {
    if (selectedDriverIndex === null) {
      alert("Please select a driver from the table first!")
      return
    }

    const driver = drivers[selectedDriverIndex]
    // Renew is 1 year from today
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    const newExpiry = nextYear.toISOString().split('T')[0]

    try {
      await api.patch(`/drivers/${driver.id}/renew-license`, { license_expiry: newExpiry })
      alert(`${driver.name}'s license renewed successfully to ${newExpiry}!`)
      fetchDrivers()
      setSelectedDriverIndex(null)
    } catch (err) {
      alert(err.message || "Failed to renew license.")
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'suspended') return 'bg-rose-50 text-rose-600 border border-rose-100'
    return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  }

  const getAlertStatus = (licenseExpiry, status) => {
    if (status === 'suspended') return { label: 'Suspended', style: 'bg-rose-50 text-rose-600 border border-rose-100' }
    
    const expiryDate = new Date(licenseExpiry)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (expiryDate < today) {
      return { label: '⚠️ Expired', style: 'bg-rose-100 text-rose-700 border border-rose-200' }
    }
    
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(today.getDate() + 30)
    
    if (expiryDate <= thirtyDaysLater) {
      return { label: '⚠️ Expiring Soon', style: 'bg-amber-50 text-amber-600 border border-amber-100' }
    }
    
    return { label: 'Compliant', style: 'bg-emerald-50 text-emerald-600 border border-emerald-100' }
  }

  return (
    <div className="flex flex-col h-full text-left text-slate-800">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Driver Compliance &amp; Safety</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Safety Officer Portal</p>
        </div>
        
        {/* User Card */}
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition duration-150"
        >
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 capitalize">{user?.role}</span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {/* Compliance Table */}
        <div className="overflow-x-auto bg-slate-50/40 border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Registry Compliance Status</h3>
          
          {loading ? (
            <div className="text-slate-400 font-medium py-8 text-center">Loading drivers compliance log...</div>
          ) : (
            <table className="w-full text-sm text-slate-605">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="py-3 px-2 text-left">Driver Name</th>
                  <th className="py-3 px-2 text-left">License No.</th>
                  <th className="py-3 px-2 text-left">Category</th>
                  <th className="py-3 px-2 text-left">License Expiry</th>
                  <th className="py-3 px-2 text-center">Safety Score</th>
                  <th className="py-3 px-2 text-center">Alert Status</th>
                  <th className="py-3 px-2 text-center">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/65">
                {drivers.length > 0 ? (
                  drivers.map((driver, idx) => {
                    const isSelected = selectedDriverIndex === idx
                    const alertObj = getAlertStatus(driver.license_expiry, driver.status)

                    return (
                      <tr 
                        key={driver.id} 
                        onClick={() => setSelectedDriverIndex(isSelected ? null : idx)}
                        className={`cursor-pointer transition duration-150 ${isSelected ? 'bg-indigo-50 hover:bg-indigo-50' : 'hover:bg-slate-50'}`}
                      >
                        <td className="py-3.5 px-2 font-bold text-slate-800">{driver.name}</td>
                        <td className="py-3.5 px-2 font-semibold">{driver.license_number}</td>
                        <td className="py-3.5 px-2 font-medium">{driver.category}</td>
                        <td className="py-3.5 px-2 font-semibold text-slate-500">{driver.license_expiry}</td>
                        <td className="py-3.5 px-2 text-center font-bold text-slate-700">{driver.safety_score}%</td>
                        <td className="py-3.5 px-2 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${alertObj.style}`}>
                            {alertObj.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          <span className={`inline-block w-24 py-1.5 rounded-lg text-xs font-bold capitalize ${getStatusBadge(driver.status)}`}>
                            {driver.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400 font-semibold">No driver records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Action Panel Row */}
        {selectedDriverIndex !== null && (
          <div className="bg-slate-50/70 border border-slate-155 p-5 rounded-3xl flex items-center justify-between text-xs font-bold shadow-sm">
            <span className="text-slate-600">
              Selected driver: <strong className="text-indigo-600">{drivers[selectedDriverIndex].name}</strong>
            </span>
            <div className="flex gap-3">
              <button
                onClick={handleSuspend}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-rose-600/10"
              >
                {drivers[selectedDriverIndex].status === 'suspended' ? 'Activate Driver' : 'Suspend Driver'}
              </button>
              <button
                onClick={handleRenew}
                className="bg-indigo-600 hover:bg-indigo-755 text-white px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/10"
              >
                Renew License (1 Year Extension)
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default ComplianceTab
