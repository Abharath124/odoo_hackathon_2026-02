import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function TripsTab({ onProfileClick }) {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  // Form Inputs
  const [source, setSource] = useState('Gandhinagar Depot')
  const [destination, setDestination] = useState('Ahmedabad Hub')
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [selectedDriverId, setSelectedDriverId] = useState('')
  const [cargoWeight, setCargoWeight] = useState('700')
  const [plannedDistance, setPlannedDistance] = useState('38')

  // Find capacity of selected vehicle
  const currentVehicleObj = vehicles.find(v => String(v.id) === String(selectedVehicleId))
  const vehicleCapacity = currentVehicleObj ? currentVehicleObj.max_capacity : 0
  const inputWeight = parseFloat(cargoWeight) || 0
  const isWeightExceeded = inputWeight > vehicleCapacity
  const exceededBy = inputWeight - vehicleCapacity

  const loadData = async () => {
    try {
      setLoading(true)
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        api.get('/trips'),
        api.get('/vehicles'),
        api.get('/drivers')
      ])

      setTrips(tripsData)
      
      const availableVehicles = vehiclesData.filter(v => v.status === 'available')
      const availableDrivers = driversData.filter(d => d.status === 'available')
      
      setVehicles(availableVehicles)
      setDrivers(availableDrivers)

      if (availableVehicles.length > 0) setSelectedVehicleId(availableVehicles[0].id)
      if (availableDrivers.length > 0) setSelectedDriverId(availableDrivers[0].id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle Form Cancel
  const handleCancel = () => {
    setSource('')
    setDestination('')
    setCargoWeight('')
    setPlannedDistance('')
  }

  // Handle dispatch click
  const handleDispatch = async (e) => {
    e.preventDefault()
    if (isWeightExceeded) return
    if (!source || !destination || !cargoWeight || !plannedDistance || !selectedVehicleId || !selectedDriverId) {
      alert("Please fill all creation fields!")
      return
    }

    const payload = {
      source,
      destination,
      vehicle_id: parseInt(selectedVehicleId),
      driver_id: parseInt(selectedDriverId),
      cargo_weight: parseFloat(cargoWeight),
      distance: parseFloat(plannedDistance)
    }

    try {
      await api.post('/trips', payload)
      alert('Trip successfully dispatched!')
      loadData()
      handleCancel()
    } catch (err) {
      alert(err.message || 'Failed to dispatch trip.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return
    try {
      await api.delete(`/trips/${id}`)
      alert("Trip deleted successfully!")
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to delete trip.')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/15 text-blue-500 border border-blue-200/50'
      case 'pending':
        return 'bg-slate-105 text-slate-500 border border-slate-250/70'
      case 'completed':
        return 'bg-emerald-50 text-emerald-500 border border-emerald-100/70'
      default:
        return 'bg-slate-100 text-slate-600'
    }
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
            placeholder="Search..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>

        {/* User profile detail bar */}
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

      {/* Main Grid splitting Dispatcher Form and Live Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Side: Create Trip Form (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          
          {/* Trip Lifecycle */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Trip Lifecycle</h3>
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute top-[18px] left-6 right-6 h-[2px] bg-slate-200 z-0" />
              {[
                { label: 'Draft', color: 'bg-emerald-500 text-emerald-600' },
                { label: 'Dispatched', color: 'bg-blue-500 text-blue-600' },
                { label: 'Completed', color: 'bg-slate-300 text-slate-400' },
                { label: 'Cancelled', color: 'bg-slate-300 text-slate-400' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center z-10 relative">
                  <div className={`w-9 h-9 rounded-full ${idx <= 1 ? 'bg-indigo-600' : 'bg-slate-200'} border-4 border-white shadow-sm flex items-center justify-center font-bold text-xs text-white`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold mt-1.5 ${idx <= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Create Trip</h2>
          <form onSubmit={handleDispatch} className="space-y-4">
            
            {/* Source */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source</label>
              <input
                type="text"
                required
                placeholder="Source Depot"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Destination */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination</label>
              <input
                type="text"
                required
                placeholder="Destination Hub"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Vehicle */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle (Available Only)</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-650 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  {vehicles.length > 0 ? (
                    vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.vehicle_name} ({v.max_capacity} kg capacity)</option>
                    ))
                  ) : (
                    <option value="">No vehicles available</option>
                  )}
                </select>
              </div>

              {/* Driver */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driver (Available Only)</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-650 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  {drivers.length > 0 ? (
                    drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))
                  ) : (
                    <option value="">No drivers available</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Cargo Weight */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cargo Weight (kg)</label>
                <input
                  type="number"
                  required
                  placeholder="Weight in kg"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Planned Distance */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Planned Distance (km)</label>
                <input
                  type="number"
                  required
                  placeholder="Distance in km"
                  value={plannedDistance}
                  onChange={(e) => setPlannedDistance(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Capacity Validation alert feedback */}
            {cargoWeight && selectedVehicleId && (
              <div className={`p-4 rounded-2xl border text-xs font-semibold ${isWeightExceeded ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                <div>Vehicle Capacity: {vehicleCapacity} kg</div>
                <div>Cargo Weight: {inputWeight} kg</div>
                {isWeightExceeded ? (
                  <div className="mt-1 flex items-center gap-1 font-bold">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Capacity exceeded by {exceededBy} kg — dispatch blocked</span>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-1 font-bold">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Weight is within safe operational capacity</span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={isWeightExceeded || !selectedVehicleId || !selectedDriverId}
                className={`flex-1 font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-lg ${isWeightExceeded || !selectedVehicleId || !selectedDriverId ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-755 text-white shadow-indigo-600/10'}`}
              >
                {isWeightExceeded ? 'Dispatch (disabled)' : 'Dispatch'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </form>

        </div>

        {/* Right Side: Live Board Listing (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Live Board</h2>
          
          {loading ? (
            <div className="text-slate-400 font-medium py-8 text-center">Loading Live Board trips...</div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {trips.map((trip) => (
                <div key={trip.id} className="border border-slate-105 hover:border-slate-200 rounded-2xl p-5 shadow-sm bg-slate-50/30 hover:bg-slate-50 transition duration-150 flex flex-col relative group">
                  
                  {/* Delete button (only visible on hover for clean UX) */}
                  {user?.role === 'fleet_manager' && (
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition duration-150 cursor-pointer hidden group-hover:block"
                      title="Delete Trip"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}

                  {/* Top line with Trip ID & Vehicle/Driver details */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600">TRIP #{trip.id}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-8">
                      {trip.vehicle?.vehicle_name || 'Unassigned'} / {trip.driver?.name || 'Unassigned'}
                    </span>
                  </div>

                  {/* Route text */}
                  <div className="text-sm font-bold text-slate-800 mb-4">
                    {trip.source} &rarr; {trip.destination}
                  </div>

                  {/* Status & Details */}
                  <div className="flex items-center justify-between mt-1">
                    <span className={`inline-block px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize ${getStatusBadge(trip.status)}`}>
                      {trip.status}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {trip.distance} km &bull; {trip.cargo_weight} kg
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Bottom workflow instruction rules */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400 tracking-wide">
            On Complete: odometer &rarr; fuel log &rarr; expenses &rarr; Vehicle &amp; Driver Available
          </div>

        </div>

      </div>

    </div>
  )
}

export default TripsTab
