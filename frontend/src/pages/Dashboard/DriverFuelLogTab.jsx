import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function DriverFuelLogTab({ onProfileClick }) {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [fuelLogs, setFuelLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [tripId, setTripId] = useState('')
  const [fuelAmount, setFuelAmount] = useState('')
  const [costPerUnit, setCostPerUnit] = useState('')

  const fetchFuelLogsAndTrips = async () => {
    try {
      setLoading(true)
      const myTrips = await api.get('/trips/my')
      setTrips(myTrips)
      
      // Auto select first completed trip if available
      const completed = myTrips.filter(t => t.status === 'completed')
      if (completed.length > 0) {
        setTripId(completed[0].id)
      }

      // Construct a history list of fuel logs from the driver's own completed trips containing fuel details
      const logs = myTrips
        .filter(t => t.status === 'completed' && t.fuel_used > 0)
        .map((t, idx) => ({
          id: idx + 1,
          trip_id: t.id,
          fuel_amount: t.fuel_used,
          cost_per_unit: 1.5,
          total_cost: t.fuel_used * 1.5,
          createdAt: t.updatedAt || new Date().toISOString()
        }))
      setFuelLogs(logs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) {
      fetchFuelLogsAndTrips()
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tripId || !fuelAmount || !costPerUnit) {
      alert("All fields are required!")
      return
    }

    const selectedTrip = trips.find(t => String(t.id) === String(tripId))
    if (!selectedTrip) {
      alert("Selected trip not found.")
      return
    }

    const amt = parseFloat(fuelAmount) || 0
    const cpu = parseFloat(costPerUnit) || 0

    const payload = {
      trip_id: parseInt(tripId),
      vehicle_id: selectedTrip.vehicle_id,
      driver_id: selectedTrip.driver_id,
      fuel_amount: amt,
      cost_per_unit: cpu
    }

    try {
      await api.post('/fuel-logs', payload)
      alert("Fuel receipt successfully logged!")
      fetchFuelLogsAndTrips()
      setFuelAmount('')
      setCostPerUnit('')
    } catch (err) {
      alert(err.message || "Failed to log fuel entry.")
    }
  }

  const completedTrips = trips.filter(t => t.status === 'completed')

  return (
    <div className="flex flex-col h-full text-left text-slate-800">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Log Fuel Receipt</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Driver Portal</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Form Column */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 block">Submit Fuel Entry</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trip ID</label>
              <select
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-650 outline-none hover:bg-slate-100 transition cursor-pointer"
              >
                {completedTrips.length > 0 ? (
                  completedTrips.map(t => (
                    <option key={t.id} value={t.id}>Trip #{t.id} ({t.source} &rarr; {t.destination})</option>
                  ))
                ) : (
                  <option value="">No completed trips available</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fuel Amount (Litres)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 40"
                  value={fuelAmount}
                  onChange={(e) => setFuelAmount(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cost per Litre ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 1.50"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {fuelAmount && costPerUnit && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-bold">
                Calculated Total Cost: ${(parseFloat(fuelAmount) * parseFloat(costPerUnit)).toFixed(2)}
              </div>
            )}

            <button
              type="submit"
              disabled={!tripId}
              className={`w-full bg-indigo-600 hover:bg-indigo-755 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-indigo-600/10 ${!tripId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Log Receipt
            </button>
          </form>
        </div>

        {/* History Column */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 block">My Fuel History</h3>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-slate-400 font-medium py-8 text-center">Loading fuel history...</div>
            ) : (
              <table className="w-full text-sm text-slate-650">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    <th className="py-3 px-2 text-left">Trip ID</th>
                    <th className="py-3 px-2 text-left">Amount (L)</th>
                    <th className="py-3 px-2 text-left">Rate</th>
                    <th className="py-3 px-2 text-left">Total Cost</th>
                    <th className="py-3 px-2 text-left">Logged Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/65">
                  {fuelLogs.length > 0 ? (
                    fuelLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition duration-150">
                        <td className="py-3.5 px-2 font-bold text-indigo-600">TR00{log.trip_id}</td>
                        <td className="py-3.5 px-2 font-semibold">{log.fuel_amount} L</td>
                        <td className="py-3.5 px-2 font-semibold">${log.cost_per_unit}</td>
                        <td className="py-3.5 px-2 font-black text-slate-700">${log.total_cost.toFixed(2)}</td>
                        <td className="py-3.5 px-2 text-slate-400 font-medium">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-semibold">No logged fuel history.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

export default DriverFuelLogTab
