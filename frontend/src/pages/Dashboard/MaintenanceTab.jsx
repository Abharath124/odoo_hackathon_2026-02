import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const lanes = [
  { name: 'Scheduled',   dotColor: 'bg-blue-500',    bg: 'bg-blue-50/60',    border: 'border-blue-200' },
  { name: 'Pending',     dotColor: 'bg-amber-500',   bg: 'bg-amber-50/60',   border: 'border-amber-200' },
  { name: 'In Progress', dotColor: 'bg-purple-500',  bg: 'bg-purple-50/60',  border: 'border-purple-200' },
  { name: 'Completed',   dotColor: 'bg-emerald-500', bg: 'bg-emerald-50/60', border: 'border-emerald-200' },
]

function MaintenanceTab({ onProfileClick }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Schedule modal
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [issue, setIssue] = useState('Oil Change')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

  // Card detail modal
  const [selectedItem, setSelectedItem] = useState(null)
  const [completionCost, setCompletionCost] = useState('280')

  // Drag state
  const dragId = useRef(null)
  const [dragOverLane, setDragOverLane] = useState(null)

  // Complete-via-drop modal
  const [dropCompleteItem, setDropCompleteItem] = useState(null)
  const [dropCost, setDropCost] = useState('280')

  const getVisualLane = (record) => {
    if (record.status === 'completed') return 'Completed'
    const issueLower = record.issue.toLowerCase()
    if (issueLower.includes('change') || issueLower.includes('rotation') || issueLower.includes('brake')) return 'Scheduled'
    if (issueLower.includes('inspection') || issueLower.includes('tune-up')) return 'Pending'
    return 'In Progress'
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [maintenanceData, vehiclesData] = await Promise.all([
        api.get('/maintenance'),
        api.get('/vehicles'),
      ])
      setItems(maintenanceData.map(r => ({
        id: r.id,
        vehicle: r.vehicle?.vehicle_name || 'Unknown Vehicle',
        registration: r.vehicle?.registration_number || '',
        date: r.start_date,
        service: r.issue,
        cost: r.cost || 0,
        status: getVisualLane(r),
        rawStatus: r.status,
      })))
      setVehicles(vehiclesData)
      if (vehiclesData.length > 0) setSelectedVehicleId(vehiclesData[0].id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleCreateService = async (e) => {
    e.preventDefault()
    try {
      await api.post('/maintenance', {
        vehicle_id: parseInt(selectedVehicleId),
        issue,
        start_date: startDate,
      })
      alert('Maintenance record successfully logged!')
      loadData()
      setIsScheduleOpen(false)
      setIssue('Oil Change')
    } catch (err) { alert(err.message || 'Failed to schedule service.') }
  }

  const handleCompleteAction = async (id, cost) => {
    if (!cost) { alert('Please specify the service completion cost!'); return }
    try {
      await api.patch(`/maintenance/${id}/complete`, {
        cost: parseFloat(cost),
        end_date: new Date().toISOString().split('T')[0],
      })
      alert('Maintenance service marked as completed!')
      loadData()
      setSelectedItem(null)
      setDropCompleteItem(null)
    } catch (err) { alert(err.message || 'Failed to complete service.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) return
    try {
      await api.delete(`/maintenance/${id}`)
      alert('Maintenance record deleted successfully!')
      loadData()
      setSelectedItem(null)
    } catch (err) { alert(err.message || 'Failed to delete record.') }
  }

  // ── Drag handlers ────────────────────────────────────────
  const onDragStart = (e, id) => {
    dragId.current = id
    e.dataTransfer.effectAllowed = 'move'
    // slight opacity on the dragged card
    e.currentTarget.style.opacity = '0.5'
  }

  const onDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDragOverLane(null)
  }

  const onDragOver = (e, laneName) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverLane(laneName)
  }

  const onDragLeave = () => setDragOverLane(null)

  const onDrop = (e, targetLane) => {
    e.preventDefault()
    setDragOverLane(null)
    const id = dragId.current
    if (!id) return

    const item = items.find(i => i.id === id)
    if (!item || item.status === targetLane) return

    if (targetLane === 'Completed') {
      // Can't complete an already-completed item
      if (item.rawStatus === 'completed') return
      // Open cost modal for completion
      setDropCompleteItem(item)
      setDropCost('280')
      return
    }

    // Visual-only move for non-completed lanes (both map to in_progress on backend)
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: targetLane } : i))
  }

  const filteredItems = items.filter(item =>
    item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.service.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full text-left text-slate-800">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input type="text" placeholder="Search board cards..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 capitalize">
            {user?.role?.replace(/_/g, ' ')}
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Maintenance Board</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Kanban • Drag cards between lanes</p>
        </div>
        {user?.role === 'fleet_manager' && (
          <button onClick={() => setIsScheduleOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Schedule Service
          </button>
        )}
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="text-slate-400 font-medium py-8 text-center flex-1">Loading maintenance board...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 flex-1 items-start">
          {lanes.map(lane => {
            const laneItems = filteredItems.filter(i => i.status === lane.name)
            const isOver = dragOverLane === lane.name

            return (
              <div
                key={lane.name}
                onDragOver={e => onDragOver(e, lane.name)}
                onDragLeave={onDragLeave}
                onDrop={e => onDrop(e, lane.name)}
                className={`flex flex-col min-h-[320px] rounded-3xl p-4 border-2 transition-all duration-150 ${
                  isOver
                    ? `${lane.bg} ${lane.border} scale-[1.01] shadow-lg`
                    : 'bg-slate-50/40 border-slate-100'
                }`}
              >
                {/* Lane header */}
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${lane.dotColor}`} />
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">{lane.name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full ml-auto">
                    {laneItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {laneItems.length > 0 ? laneItems.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={e => onDragStart(e, item.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => setSelectedItem(item)}
                      className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-150 cursor-grab active:cursor-grabbing flex flex-col text-left select-none"
                    >
                      {/* Drag handle hint */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-800">{item.vehicle}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                          {/* drag dots */}
                          <svg className="w-3 h-3 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                            <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                            <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                          </svg>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 mb-3">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.757l-8.389 8.389a2.25 2.25 0 01-3.182-3.182l8.39-8.39c.685-.685.847-1.874.756-2.95a4.5 4.5 0 014.5-4.885h2.25A2.25 2.25 0 0121.75 6.75z" />
                        </svg>
                        <span>{item.service}</span>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-semibold text-slate-400">{item.registration}</span>
                        <span className="text-xs font-black text-slate-700">₹{item.cost}</span>
                      </div>
                    </div>
                  )) : (
                    <div className={`border-2 border-dashed rounded-2xl h-24 flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                      isOver ? `${lane.border} text-slate-500` : 'border-slate-200 text-slate-400'
                    }`}>
                      {isOver ? '↓ Drop here' : 'No items'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Schedule Service Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Schedule Service</h3>
              <button onClick={() => setIsScheduleOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</label>
                <select value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none cursor-pointer">
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicle_name} ({v.registration_number})</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Type</label>
                <input type="text" required placeholder="e.g. Oil Change" value={issue}
                  onChange={e => setIssue(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
                <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
              </div>
              <button type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition mt-4 cursor-pointer shadow-lg shadow-indigo-600/10">
                Log Service
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Drop-to-Complete cost modal */}
      {dropCompleteItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-slate-800 text-left">
            <h3 className="text-lg font-black tracking-tight mb-1">Complete Service</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">
              {dropCompleteItem.vehicle} — {dropCompleteItem.service}
            </p>
            <div className="flex flex-col gap-1 mb-6">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Cost (₹)</label>
              <input type="number" value={dropCost} onChange={e => setDropCost(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDropCompleteItem(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-xs transition cursor-pointer">
                Cancel
              </button>
              <button onClick={() => handleCompleteAction(dropCompleteItem.id, dropCost)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer">
                Confirm Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black tracking-tight">{selectedItem.vehicle}</h3>
              <button onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {[
                ['Service', selectedItem.service],
                ['Registration', selectedItem.registration],
                ['Start Date', selectedItem.date],
                ['Cost', `₹${selectedItem.cost}`],
                ['Status', selectedItem.rawStatus],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between border-b border-slate-100 pb-2 last:border-0">
                  <span className="text-xs font-bold text-slate-400">{label}</span>
                  <span className="text-xs font-bold text-slate-800 capitalize">{val}</span>
                </div>
              ))}
            </div>

            {selectedItem.rawStatus === 'in_progress' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Cost (₹)</label>
                  <input type="number" value={completionCost} onChange={e => setCompletionCost(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleCompleteAction(selectedItem.id, completionCost)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer">
                    Complete Service
                  </button>
                  {user?.role === 'fleet_manager' && (
                    <button onClick={() => handleDelete(selectedItem.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer">
                      Delete Log
                    </button>
                  )}
                </div>
              </div>
            )}

            {selectedItem.rawStatus === 'completed' && user?.role === 'fleet_manager' && (
              <button onClick={() => handleDelete(selectedItem.id)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer">
                Delete Log
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default MaintenanceTab
