import { useState } from 'react'

// Mock initial vehicle data from slide 9
const initialVehicles = [
  { vehicle: 'VAN-01', model: 'Ford Transit 350', registration: 'KBA 001A', status: 'Available', driver: '—', health: 92, fuel: '78%', nextService: 'Aug 12' },
  { vehicle: 'VAN-05', model: 'Toyota HiAce', registration: 'KBC 345D', status: 'Maintenance', driver: '—', health: 61, fuel: '45%', nextService: 'Jul 14' },
  { vehicle: 'VAN-07', model: 'Mercedes Sprinter', registration: 'KBB 782F', status: 'On Trip', driver: 'Marcus Chen', health: 83, fuel: '62%', nextService: 'Sep 2' },
  { vehicle: 'BUS-02', model: 'Yutong ZK6108', registration: 'KBA 231G', status: 'Available', driver: '—', health: 79, fuel: '91%', nextService: 'Aug 5' },
  { vehicle: 'TRK-03', model: 'Isuzu NPR 400', registration: 'KBC 119J', status: 'On Trip', driver: 'James Rivera', health: 84, fuel: '55%', nextService: 'Aug 20' },
  { vehicle: 'BUS-05', model: 'King Long XMQ6110', registration: 'KBD 777K', status: 'Available', driver: '—', health: 71, fuel: '83%', nextService: 'Jul 28' },
]

function FleetTab({ onProfileClick }) {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Add Vehicle modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState('')
  const [newModel, setNewModel] = useState('')
  const [newReg, setNewReg] = useState('')
  const [newStatus, setNewStatus] = useState('Available')
  const [newDriver, setNewDriver] = useState('—')
  const [newHealth, setNewHealth] = useState('90')
  const [newFuel, setNewFuel] = useState('80')
  const [newNextService, setNewNextService] = useState('Aug 12')

  const handleAddVehicle = (e) => {
    e.preventDefault()
    if (!newVehicle || !newModel || !newReg) {
      alert("Please fill all required inputs!")
      return
    }

    const newItem = {
      vehicle: newVehicle,
      model: newModel,
      registration: newReg,
      status: newStatus,
      driver: newDriver,
      health: parseInt(newHealth) || 100,
      fuel: newFuel.endsWith('%') ? newFuel : `${newFuel}%`,
      nextService: newNextService
    }

    setVehicles([...vehicles, newItem])
    setIsAddOpen(false)

    // Reset Form
    setNewVehicle('')
    setNewModel('')
    setNewReg('')
  }

  // Filter logic
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registration.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'All' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (val) => {
    switch (val) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'On Trip':
        return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'Maintenance':
        return 'bg-rose-50 text-rose-600 border border-rose-100'
      default:
        return 'bg-slate-100 text-slate-500'
    }
  }

  const getHealthBarColor = (h) => {
    if (h >= 80) return 'bg-emerald-500'
    if (h >= 70) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  const handleExport = () => {
    // Generate CSV data from state
    const headers = 'Vehicle,Model,Registration,Status,Driver,Health,Fuel,Next Service\n'
    const rows = vehicles.map(v => `${v.vehicle},${v.model},${v.registration},${v.status},${v.driver},${v.health}%,${v.fuel},${v.nextService}`).join('\n')
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows)
    
    // Download link
    const link = document.createElement("a")
    link.setAttribute("href", csvContent)
    link.setAttribute("download", "vehicle_registry.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Header and subtitle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Vehicle Registry</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{vehicles.length} vehicles registered</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="bg-slate-100 hover:bg-slate-250 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Export</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
          >
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

      {/* Main Vehicles Table */}
      <div className="overflow-x-auto text-left flex-1 min-h-[300px]">
        <table className="w-full text-sm text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
              <th className="py-3 px-2 text-left">Vehicle</th>
              <th className="py-3 px-2 text-left">Model</th>
              <th className="py-3 px-2 text-left">Registration</th>
              <th className="py-3 px-2 text-left">Status</th>
              <th className="py-3 px-2 text-left">Driver</th>
              <th className="py-3 px-2 text-left">Health</th>
              <th className="py-3 px-2 text-left">Fuel</th>
              <th className="py-3 px-2 text-left">Next Service</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/65">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((v, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition duration-150">
                  <td className="py-4 px-2 font-bold text-slate-800">{v.vehicle}</td>
                  <td className="py-4 px-2 font-semibold text-slate-700">{v.model}</td>
                  <td className="py-4 px-2 text-slate-500 font-medium">{v.registration}</td>
                  <td className="py-4 px-2">
                    <span className={`inline-block w-28 text-center py-1.5 rounded-lg text-xs font-bold capitalize ${getStatusBadge(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-medium">{v.driver}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200/60 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`${getHealthBarColor(v.health)} h-full rounded-full`}
                          style={{ width: `${v.health}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{v.health}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-bold text-slate-700">{v.fuel}</td>
                  <td className="py-4 px-2 font-medium text-slate-400">{v.nextService}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-6 text-center text-slate-400 font-medium">
                  No matching vehicles registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Vehicle Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Add Registered Vehicle</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VAN-09"
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ford Transit 350"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registration Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KBD 777K"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Driver</label>
                  <input
                    type="text"
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health (%)</label>
                  <input
                    type="number"
                    value={newHealth}
                    onChange={(e) => setNewHealth(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fuel (%)</label>
                  <input
                    type="number"
                    value={newFuel}
                    onChange={(e) => setNewFuel(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Service Date</label>
                <input
                  type="text"
                  value={newNextService}
                  onChange={(e) => setNewNextService(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3 rounded-xl text-sm transition mt-6 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                Register Vehicle
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default FleetTab
