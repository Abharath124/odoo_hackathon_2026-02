import { useState } from 'react'

// Available Vehicles Mock data with capacity
const availableVehicles = [
  { id: 'VAN-05', name: 'VAN-05 (500 kg capacity)', capacity: 500 },
  { id: 'TRUCK-11', name: 'TRUCK-11 (5,000 kg capacity)', capacity: 5000 },
  { id: 'MINI-03', name: 'MINI-03 (1,000 kg capacity)', capacity: 1000 },
]

// Available Drivers Mock data
const availableDrivers = [
  { id: 'Alex', name: 'Alex' },
  { id: 'Steve', name: 'Steve' },
  { id: 'Priya', name: 'Priya' },
]

// Live Board default mock trips
const defaultLiveTrips = [
  { id: 'TR001', vehicle: 'VAN-05', driver: 'ALEX', route: 'Gandhinagar Depot -> Ahmedabad Hub', status: 'Dispatched', eta: '45 min' },
  { id: 'TR004', vehicle: 'TRUCK-04', driver: 'SURESH', route: 'Vatva Industrial Area -> Sanand Warehouse', status: 'Draft', eta: 'Awaiting driver' },
  { id: 'TR006', vehicle: 'Unassigned', driver: 'Unassigned', route: 'Mansa -> Kalol Depot', status: 'Cancelled', eta: 'Vehicle went to shop' },
]

function TripsTab({ onProfileClick }) {
  const [liveTrips, setLiveTrips] = useState(defaultLiveTrips)

  // Form Inputs
  const [source, setSource] = useState('Gandhinagar Depot')
  const [destination, setDestination] = useState('Ahmedabad Hub')
  const [selectedVehicleId, setSelectedVehicleId] = useState('VAN-05')
  const [selectedDriver, setSelectedDriver] = useState('Alex')
  const [cargoWeight, setCargoWeight] = useState('700')
  const [plannedDistance, setPlannedDistance] = useState('38')

  // Find capacity of selected vehicle
  const currentVehicleObj = availableVehicles.find(v => v.id === selectedVehicleId)
  const vehicleCapacity = currentVehicleObj ? currentVehicleObj.capacity : 0
  const inputWeight = parseFloat(cargoWeight) || 0
  const isWeightExceeded = inputWeight > vehicleCapacity
  const exceededBy = inputWeight - vehicleCapacity

  // Handle Form Cancel
  const handleCancel = () => {
    setSource('')
    setDestination('')
    setCargoWeight('')
    setPlannedDistance('')
  }

  // Handle dispatch click
  const handleDispatch = (e) => {
    e.preventDefault()
    if (isWeightExceeded) return
    if (!source || !destination || !cargoWeight || !plannedDistance) {
      alert("Please fill all creation fields!")
      return
    }

    const newTripId = `TR00${liveTrips.length + 5}`
    const newTrip = {
      id: newTripId,
      vehicle: selectedVehicleId,
      driver: selectedDriver.toUpperCase(),
      route: `${source} -> ${destination}`,
      status: 'Dispatched',
      eta: `${Math.floor(Math.random() * 90) + 15} min`,
    }

    setLiveTrips([newTrip, ...liveTrips])
    alert(`Trip ${newTripId} successfully dispatched!`)
    handleCancel()
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
          <span className="text-sm font-semibold text-slate-700">Raven K.</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">Dispatcher</span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            RK
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
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Driver */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driver (Available Only)</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  {availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
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
            {cargoWeight && (
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
                disabled={isWeightExceeded}
                className={`flex-1 font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-lg ${isWeightExceeded ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-755 text-white shadow-indigo-600/10'}`}
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
          
          <div className="space-y-4">
            {liveTrips.map((trip) => {
              const getBadgeStyle = (status) => {
                switch (status) {
                  case 'Dispatched':
                    return 'bg-blue-500/15 text-blue-500 border border-blue-200/50'
                  case 'Draft':
                    return 'bg-slate-100 text-slate-500 border border-slate-250/70'
                  case 'Cancelled':
                    return 'bg-rose-50 text-rose-500 border border-rose-100/70'
                  default:
                    return 'bg-slate-100 text-slate-600'
                }
              }

              return (
                <div key={trip.id} className="border border-slate-100 hover:border-slate-200/80 rounded-2xl p-5 shadow-sm bg-slate-50/30 hover:bg-slate-50 transition duration-150 flex flex-col">
                  
                  {/* Top line with Trip ID & Vehicle/Driver details */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600">{trip.id}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      {trip.vehicle} / {trip.driver}
                    </span>
                  </div>

                  {/* Route text */}
                  <div className="text-sm font-bold text-slate-800 mb-4">
                    {trip.route}
                  </div>

                  {/* Status & ETA */}
                  <div className="flex items-center justify-between mt-1">
                    <span className={`inline-block px-3.5 py-1.5 rounded-lg text-xs font-bold ${getBadgeStyle(trip.status)}`}>
                      {trip.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {trip.eta}
                    </span>
                  </div>

                </div>
              )
            })}
          </div>

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
