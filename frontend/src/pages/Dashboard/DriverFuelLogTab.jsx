import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'

const BASE = 'http://localhost:5000/api'

function DriverFuelLogTab({ onProfileClick }) {
  const { user } = useAuth()
  const token = user?.token

  const [myTrips, setMyTrips] = useState([])
  const [myDriverId, setMyDriverId] = useState(null)
  const [logs, setLogs] = useState([])
  const [loadingTrips, setLoadingTrips] = useState(true)

  // Form state
  const [tripId, setTripId] = useState('')
  const [fuelAmount, setFuelAmount] = useState('')
  const [costPerUnit, setCostPerUnit] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  // Fetch driver's completed/active trips to pick from
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${BASE}/trips/my`, { headers })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        // Only allow fuel log on active or completed trips
        const eligible = data.filter(t => t.status === 'active' || t.status === 'completed')
        setMyTrips(eligible)
        if (eligible.length > 0) setTripId(String(eligible[0].id))
        // Grab driver_id from first trip
        if (data.length > 0) setMyDriverId(data[0].driver_id)
      } catch (err) {
        showError(err.message)
      } finally {
        setLoadingTrips(false)
      }
    }
    fetchTrips()
  }, [])

  // Fetch existing fuel logs for this driver (via all fuel logs — filtered client side)
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BASE}/fuel-logs`, { headers })
        if (!res.ok) return
        const data = await res.json()
        // Filter to only this driver's logs
        if (myDriverId) {
          setLogs(data.filter(l => l.driver_id === myDriverId))
        }
      } catch {
        // non-critical, driver may not have financial_analyst access — skip silently
      }
    }
    if (myDriverId) fetchLogs()
  }, [myDriverId])

  const selectedTrip = myTrips.find(t => String(t.id) === String(tripId))
  const totalCost = fuelAmount && costPerUnit
    ? (parseFloat(fuelAmount) * parseFloat(costPerUnit)).toFixed(2)
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tripId || !fuelAmount || !costPerUnit) return
    if (!selectedTrip) { showError('Please select a valid trip.'); return }

    try {
      setSubmitting(true)
      const res = await fetch(`${BASE}/fuel-logs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          trip_id: parseInt(tripId),
          vehicle_id: selectedTrip.vehicle_id,
          driver_id: selectedTrip.driver_id,
          fuel_amount: parseFloat(fuelAmount),
          cost_per_unit: parseFloat(costPerUnit),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showSuccess('Fuel log submitted successfully!')
      setFuelAmount('')
      setCostPerUnit('')
      // Add to local logs list
      setLogs(prev => [data.fuelLog, ...prev])
    } catch (err) {
      showError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full text-left text-slate-800">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Submit Fuel Log</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Log fuel usage after a trip</p>
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">Driver</span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">

        {/* Left: Form */}
        <div className="lg:col-span-5 flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Fuel Entry Form</h3>

          {loadingTrips ? (
            <p className="text-sm text-slate-400 font-semibold">Loading your trips...</p>
          ) : myTrips.length === 0 ? (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-xs font-semibold text-amber-600">
              No active or completed trips found. Start a trip first before logging fuel.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Trip selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Trip</label>
                <select
                  value={tripId}
                  onChange={e => setTripId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  {myTrips.map(t => (
                    <option key={t.id} value={t.id}>
                      #{t.id} — {t.source} &#8594; {t.destination} ({t.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected trip info */}
              {selectedTrip && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-500 space-y-1">
                  <div className="flex justify-between"><span className="text-slate-400">Vehicle</span><span>{selectedTrip.vehicle?.vehicle_name || selectedTrip.vehicle_id}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Distance</span><span>{selectedTrip.distance} km</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Fuel Used (trip)</span><span>{selectedTrip.fuel_used ?? '—'} L</span></div>
                </div>
              )}

              {/* Fuel Amount */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fuel Amount (L)</label>
                <input
                  type="number" required value={fuelAmount}
                  onChange={e => setFuelAmount(e.target.value)}
                  placeholder="e.g. 45"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Cost Per Unit */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cost Per Litre</label>
                <input
                  type="number" required value={costPerUnit}
                  onChange={e => setCostPerUnit(e.target.value)}
                  placeholder="e.g. 70"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Live total cost preview */}
              {totalCost && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Total Cost</span>
                  <span className="text-lg font-black text-indigo-700">{parseFloat(totalCost).toLocaleString()}</span>
                </div>
              )}

              <button
                type="submit" disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-amber-500/10 disabled:opacity-60 mt-2"
              >
                {submitting ? 'Submitting...' : 'Submit Fuel Log'}
              </button>
            </form>
          )}
        </div>

        {/* Right: My Fuel Log History */}
        <div className="lg:col-span-7 flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">My Fuel Log History</h3>

          {logs.length === 0 ? (
            <div className="text-sm text-slate-400 font-semibold">No fuel logs submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    <th className="py-3 px-2 text-left">Trip</th>
                    <th className="py-3 px-2 text-left">Fuel (L)</th>
                    <th className="py-3 px-2 text-left">Cost/L</th>
                    <th className="py-3 px-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/65">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-2 font-bold text-indigo-600">#{log.trip_id}</td>
                      <td className="py-3.5 px-2 font-semibold">{log.fuel_amount} L</td>
                      <td className="py-3.5 px-2 font-medium">{log.cost_per_unit}</td>
                      <td className="py-3.5 px-2 font-bold text-slate-800">{log.total_cost?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DriverFuelLogTab
