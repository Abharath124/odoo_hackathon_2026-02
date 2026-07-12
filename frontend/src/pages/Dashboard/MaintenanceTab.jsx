import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

// Initial kanban cards
const initialMaintenanceItems = [
  { id: 1, vehicle: 'VAN-03', date: 'Jul 14', service: 'Oil Change', driver: 'Tony Bravo', cost: 280, status: 'Scheduled' },
  { id: 2, vehicle: 'TRK-02', date: 'Jul 15', service: 'Brake Service', driver: 'Maria Santos', cost: 840, status: 'Scheduled' },
  { id: 3, vehicle: 'VAN-08', date: 'Jul 19', service: 'Tire Rotation', driver: 'Lee Chang', cost: 160, status: 'Scheduled' },
  { id: 4, vehicle: 'BUS-01', date: 'Jul 17', service: 'Full Inspection', driver: 'Tony Bravo', cost: 1200, status: 'Pending' },
  { id: 5, vehicle: 'TRK-05', date: 'Jul 22', service: 'Engine Tune-Up', driver: 'Maria Santos', cost: 960, status: 'Pending' },
  { id: 6, vehicle: 'VAN-01', date: 'Jul 08', service: 'Oil Change', driver: 'Tony Bravo', cost: 280, status: 'Completed' },
  { id: 7, vehicle: 'BUS-04', date: 'Jul 10', service: 'Full Inspection', driver: 'Lee Chang', cost: 1200, status: 'Completed' },
]

const lanes = [
  { name: 'Scheduled', dotColor: 'bg-blue-500', textColor: 'text-blue-500' },
  { name: 'Pending', dotColor: 'bg-amber-500', textColor: 'text-amber-500' },
  { name: 'In Progress', dotColor: 'bg-purple-500', textColor: 'text-purple-500' },
  { name: 'Completed', dotColor: 'bg-emerald-500', textColor: 'text-emerald-500' },
]

function MaintenanceTab({ onProfileClick }) {
  const { user } = useAuth()
  const [items, setItems] = useState(initialMaintenanceItems)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal schedule service
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState('VAN-03')
  const [newDate, setNewDate] = useState('Jul 14')
  const [newService, setNewService] = useState('Oil Change')
  const [newDriver, setNewDriver] = useState('Tony Bravo')
  const [newCost, setNewCost] = useState('280')
  const [newStatus, setNewStatus] = useState('Scheduled')

  // Selected card details modal / action popup
  const [selectedItem, setSelectedItem] = useState(null)

  const filteredItems = items.filter(item =>
    item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.driver.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateService = (e) => {
    e.preventDefault()
    if (!newVehicle || !newDate || !newService || !newDriver || !newCost) {
      alert("Please fill all required inputs!")
      return
    }

    const newItem = {
      id: items.length + 1,
      vehicle: newVehicle,
      date: newDate,
      service: newService,
      driver: newDriver,
      cost: parseFloat(newCost) || 0,
      status: newStatus
    }

    setItems([...items, newItem])
    setIsScheduleOpen(false)
    
    // Reset Form
    setNewCost('')
    setNewService('')
  }

  // Move card helper
  const moveCard = (id, targetLane) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, status: targetLane }
      }
      return item
    })
    setItems(updated)
    setSelectedItem(null)
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
            placeholder="Search board cards..."
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
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 capitalize">
            {user?.role?.replace(/_/g, ' ')}
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Title & Action Button Row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Maintenance Board</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Kanban • July 2025</p>
        </div>
        <button
          onClick={() => setIsScheduleOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Schedule Service</span>
        </button>
      </div>

      {/* Kanban lanes content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 items-start min-h-[400px]">
        {lanes.map((lane) => {
          const laneItems = filteredItems.filter(i => i.status === lane.name)
          
          return (
            <div key={lane.name} className="flex flex-col h-full bg-slate-50/40 border border-slate-100 rounded-3xl p-4 min-h-[300px]">
              
              {/* Lane Title */}
              <div className="flex items-center gap-2 mb-4 px-1.5 justify-start">
                <span className={`w-2.5 h-2.5 rounded-full ${lane.dotColor}`} />
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">{lane.name}</span>
                <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full ml-auto">
                  {laneItems.length}
                </span>
              </div>

              {/* Lane Cards container */}
              <div className="space-y-4 flex-1">
                {laneItems.length > 0 ? (
                  laneItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-200 cursor-pointer flex flex-col text-left text-slate-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-800">{item.vehicle}</span>
                        <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.757l-8.389 8.389a2.25 2.25 0 01-3.182-3.182l8.39-8.39c.685-.685.847-1.874.756-2.95a4.5 4.5 0 014.5-4.885h2.25A2.25 2.25 0 0121.75 6.75z" />
                        </svg>
                        <span>{item.service}</span>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-semibold text-slate-400">{item.driver}</span>
                        <span className="text-xs font-black text-slate-700">${item.cost}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-2xl h-24 flex items-center justify-center text-xs font-bold text-slate-400">
                    No items
                  </div>
                )}
              </div>

            </div>
          )
        })}
      </div>

      {/* Schedule Service Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Schedule Service</h3>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</label>
                <select
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  <option value="VAN-03">VAN-03</option>
                  <option value="TRK-02">TRK-02</option>
                  <option value="VAN-08">VAN-08</option>
                  <option value="BUS-01">BUS-01</option>
                  <option value="TRK-05">TRK-05</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Type</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oil Change"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jul 14"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Driver / Mechanic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tony Bravo"
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cost ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 280"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lane</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3 rounded-xl text-sm transition mt-6 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                Log Service
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Card Detail / Update status Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black tracking-tight">{selectedItem.vehicle}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-400">Service</span>
                <span className="text-xs font-bold text-slate-800">{selectedItem.service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-400">Driver</span>
                <span className="text-xs font-bold text-slate-800">{selectedItem.driver}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-400">Date</span>
                <span className="text-xs font-bold text-slate-800">{selectedItem.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-400">Estimated Cost</span>
                <span className="text-xs font-black text-slate-800">${selectedItem.cost}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-xs font-bold text-slate-400">Current Status</span>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{selectedItem.status}</span>
              </div>
            </div>

            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Move to Lane:</h4>
            <div className="grid grid-cols-2 gap-3">
              {lanes.filter(l => l.name !== selectedItem.status).map(l => (
                <button
                  key={l.name}
                  onClick={() => moveCard(selectedItem.id, l.name)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  {l.name}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default MaintenanceTab
