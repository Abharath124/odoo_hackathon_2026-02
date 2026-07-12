import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function MyTripsTab({ onProfileClick }) {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  // Start/Complete Trip Dialog Form states
  const [activeTrip, setActiveTrip] = useState(null)
  const [actionType, setActionType] = useState('') // 'start' or 'complete'
  const [odometer, setOdometer] = useState('')
  const [fuelUsed, setFuelUsed] = useState('')

  // Fetch driver's trips from backend
  const fetchMyTrips = async () => {
    try {
      setLoading(true)
      const data = await api.get('/trips/my')
      setTrips(data)
    } catch (err) {
      console.error(err)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) {
      fetchMyTrips()
    }
  }, [user])

  const handleActionSubmit = async (e) => {
    e.preventDefault()
    if (!odometer) {
      alert("Please enter the odometer reading!")
      return
    }

    try {
      if (actionType === 'start') {
        // start trip sends start_odometer in some backend models, let's pass it
        await api.patch(`/trips/${activeTrip.id}/start`, { start_odometer: parseFloat(odometer) })
      } else {
        await api.patch(`/trips/${activeTrip.id}/complete`, {
          end_odometer: parseFloat(odometer),
          fuel_used: parseFloat(fuelUsed) || 0
        })
      }
      alert(`Trip successfully ${actionType}ed!`)
      fetchMyTrips()
      setActiveTrip(null)
      setOdometer('')
      setFuelUsed('')
    } catch (err) {
      alert(err.message || `Failed to ${actionType} trip.`)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'active':
        return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'pending':
        return 'bg-amber-50 text-amber-600 border border-amber-100'
      default:
        return 'bg-slate-100 text-slate-500'
    }
  }

  return (
    <div className="flex flex-col h-full text-left text-slate-800">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">My Assigned Trips</h2>
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

      {loading ? (
        <div className="text-slate-400 font-medium py-8 text-center">Loading assigned trips...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.length > 0 ? (
            trips.map(trip => (
              <div key={trip.id} className="border border-slate-150 rounded-3xl p-6 bg-slate-50/40 hover:bg-slate-50 transition duration-150 flex flex-col justify-between h-[230px] shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-indigo-600">TRIP #{trip.id}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-black text-slate-800 mb-2 truncate">
                    {trip.source} &rarr; {trip.destination}
                  </h4>

                  <div className="text-xs text-slate-500 font-semibold space-y-1">
                    <div>Vehicle: <strong className="text-slate-700">{trip.vehicle?.vehicle_name || 'Unassigned'} ({trip.vehicle?.registration_number || ''})</strong></div>
                    <div>Cargo Weight: <strong className="text-slate-700">{trip.cargo_weight} kg</strong></div>
                    <div>Planned Distance: <strong className="text-slate-700">{trip.distance} km</strong></div>
                    {trip.start_odometer && <div>Start Odometer: <strong className="text-slate-700">{trip.start_odometer} km</strong></div>}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {trip.status === 'pending' && (
                    <button
                      onClick={() => {
                        setActiveTrip(trip)
                        setActionType('start')
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-755 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      Start Trip
                    </button>
                  )}
                  {trip.status === 'active' && (
                    <button
                      onClick={() => {
                        setActiveTrip(trip)
                        setActionType('complete')
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                    >
                      Complete Trip
                    </button>
                  )}
                  {trip.status === 'completed' && (
                    <span className="w-full bg-slate-200 text-slate-500 font-bold py-2 rounded-xl text-xs text-center border border-slate-300">
                      Finished
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-400 font-medium py-8 text-center col-span-full">No trips assigned to you yet.</div>
          )}
        </div>
      )}

      {/* Start / Complete Modal Form */}
      {activeTrip && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black tracking-tight capitalize">{actionType} Trip #{activeTrip.id}</h3>
              <button
                onClick={() => setActiveTrip(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {actionType === 'start' ? 'Start Odometer Reading' : 'End Odometer Reading'}
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 74000"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {actionType === 'complete' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fuel Used (Litres)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={fuelUsed}
                    onChange={(e) => setFuelUsed(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-755 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-lg"
              >
                Confirm {actionType}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default MyTripsTab
