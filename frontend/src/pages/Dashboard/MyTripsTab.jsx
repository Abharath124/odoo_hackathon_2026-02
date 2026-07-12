import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'

const BASE = 'http://localhost:5000/api'

function MyTripsTab({ onProfileClick }) {
  const { user } = useAuth()
  const token = user?.token

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  // Complete trip modal state
  const [completeModal, setCompleteModal] = useState(null) // trip object
  const [endOdometer, setEndOdometer] = useState('')
  const [fuelUsed, setFuelUsed] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE}/trips/my`, { headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setTrips(data)
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrips() }, [])

  const handleStart = async (tripId) => {
    try {
      const res = await fetch(`${BASE}/trips/${tripId}/start`, { method: 'PATCH', headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showSuccess('Trip started successfully!')
      fetchTrips()
    } catch (err) {
      showError(err.message)
    }
  }

  const handleComplete = async (e) => {
    e.preventDefault()
    if (!endOdometer || !fuelUsed) return
    try {
      setSubmitting(true)
      const res = await fetch(`${BASE}/trips/${completeModal.id}/complete`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          end_odometer: parseFloat(endOdometer),
          fuel_used: parseFloat(fuelUsed),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showSuccess('Trip completed successfully!')
      setCompleteModal(null)
      setEndOdometer('')
      setFuelUsed('')
      fetchTrips()
    } catch (err) {
      showError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const activeTrip = trips.find(t => t.status === 'active')
  const pendingTrips = trips.filter(t => t.status === 'pending')
  const completedTrips = trips.filter(t => t.status === 'completed')

  const statusBadge = (status) => {
    switch (status) {
      case 'active':    return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'pending':   return 'bg-amber-50 text-amber-600 border border-amber-100'
      case 'completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      default:          return 'bg-slate-100 text-slate-500'
    }
  }

  return (
    <div className="flex flex-col h-full text-left text-slate-800">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">My Trips</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{trips.length} total trips assigned</p>
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">Driver</span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1 text-slate-400 text-sm font-semibold">Loading trips...</div>
      ) : (
        <div className="flex flex-col gap-8 flex-1 overflow-y-auto">

          {/* Active Trip */}
          {activeTrip && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active Trip</h3>
              <TripCard
                trip={activeTrip}
                statusBadge={statusBadge}
                onComplete={() => { setCompleteModal(activeTrip); setEndOdometer(String(activeTrip.start_odometer || '')) }}
              />
            </div>
          )}

          {/* Pending Trips */}
          {pendingTrips.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pending — Ready to Start</h3>
              <div className="space-y-3">
                {pendingTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} statusBadge={statusBadge} onStart={() => handleStart(trip.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Trip History */}
          {completedTrips.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trip History</h3>
              <div className="space-y-3">
                {completedTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} statusBadge={statusBadge} />
                ))}
              </div>
            </div>
          )}

          {trips.length === 0 && (
            <div className="flex items-center justify-center flex-1 text-slate-400 text-sm font-semibold">
              No trips assigned yet.
            </div>
          )}
        </div>
      )}

      {/* Complete Trip Modal */}
      {completeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Complete Trip #{completeModal.id}</h3>
              <button onClick={() => setCompleteModal(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              {completeModal.source} &#8594; {completeModal.destination}
            </p>
            <form onSubmit={handleComplete} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">End Odometer (km)</label>
                <input
                  type="number" required value={endOdometer}
                  onChange={e => setEndOdometer(e.target.value)}
                  placeholder={`Start: ${completeModal.start_odometer} km`}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fuel Used (L)</label>
                <input
                  type="number" required value={fuelUsed}
                  onChange={e => setFuelUsed(e.target.value)}
                  placeholder="e.g. 45"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer shadow-lg shadow-emerald-600/10 disabled:opacity-60 mt-2"
              >
                {submitting ? 'Completing...' : 'Mark as Completed'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TripCard({ trip, statusBadge, onStart, onComplete }) {
  return (
    <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/40 hover:bg-slate-50 transition flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-600">Trip #{trip.id}</span>
        <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${statusBadge(trip.status)}`}>
          {trip.status}
        </span>
      </div>

      <div className="text-sm font-bold text-slate-800">
        {trip.source} &#8594; {trip.destination}
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs font-semibold text-slate-500">
        <div><span className="text-slate-400 block font-bold uppercase text-[10px]">Vehicle</span>{trip.vehicle?.vehicle_name || trip.vehicle_id}</div>
        <div><span className="text-slate-400 block font-bold uppercase text-[10px]">Distance</span>{trip.distance} km</div>
        <div><span className="text-slate-400 block font-bold uppercase text-[10px]">Cargo</span>{trip.cargo_weight} kg</div>
      </div>

      {trip.status === 'completed' && (
        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-3">
          <div><span className="text-slate-400 block font-bold uppercase text-[10px]">End Odometer</span>{trip.end_odometer} km</div>
          <div><span className="text-slate-400 block font-bold uppercase text-[10px]">Fuel Used</span>{trip.fuel_used} L</div>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {onStart && (
          <button onClick={onStart} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-indigo-600/10">
            ▶ Start Trip
          </button>
        )}
        {onComplete && (
          <button onClick={onComplete} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-emerald-600/10">
            ✓ Complete Trip
          </button>
        )}
      </div>
    </div>
  )
}

export default MyTripsTab
