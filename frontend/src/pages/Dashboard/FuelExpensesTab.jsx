import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'

function FuelExpensesTab({ onProfileClick }) {
  const { user } = useAuth()
  const [fuelLogs, setFuelLogs] = useState([])
  const [expenses, setExpenses] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [expForm, setExpForm] = useState({ vehicle_id: '', expense_type: 'toll', amount: '', description: '' })

  const fetchAll = () => {
    setLoading(true)
    Promise.all([
      api.get('/fuel-logs'),
      api.get('/expenses'),
      api.get('/vehicles'),
    ])
      .then(([logs, exps, vehs]) => {
        setFuelLogs(logs)
        setExpenses(exps)
        setVehicles(vehs)
      })
      .catch(e => showError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  const handleDeleteFuel = async (id) => {
    if (!window.confirm('Delete this fuel log?')) return
    try {
      await api.delete(`/fuel-logs/${id}`)
      showSuccess('Fuel log deleted.')
      fetchAll()
    } catch (e) { showError(e.message) }
  }

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await api.delete(`/expenses/${id}`)
      showSuccess('Expense deleted.')
      fetchAll()
    } catch (e) { showError(e.message) }
  }

  const handleSaveExpense = async (e) => {
    e.preventDefault()
    try {
      await api.post('/expenses', {
        vehicle_id: parseInt(expForm.vehicle_id),
        expense_type: expForm.expense_type,
        amount: parseFloat(expForm.amount),
        description: expForm.description,
      })
      showSuccess('Expense added.')
      setIsExpenseModalOpen(false)
      setExpForm({ vehicle_id: '', expense_type: 'toll', amount: '', description: '' })
      fetchAll()
    } catch (e) { showError(e.message) }
  }

  const totalFuelCost = fuelLogs.reduce((sum, l) => sum + (l.total_cost || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const totalOperationalCost = totalFuelCost + totalExpenses

  const filteredFuelLogs = fuelLogs.filter(log =>
    log.vehicle?.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.driver?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredExpenses = expenses.filter(exp =>
    exp.vehicle?.vehicle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.expense_type?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const expTypeBadge = (type) => {
    switch (type) {
      case 'toll':      return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'repair':    return 'bg-rose-50 text-rose-600 border border-rose-100'
      case 'service':   return 'bg-amber-50 text-amber-600 border border-amber-100'
      case 'insurance': return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      default:          return 'bg-slate-100 text-slate-500'
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
            type="text" placeholder="Search records..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition duration-150">
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
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Fuel &amp; Expense Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <div className="space-y-8 flex-1 flex flex-col justify-between">
        <div className="space-y-8">

          {/* FUEL LOGS */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Fuel Logs</h3>
            {loading ? (
              <div className="text-slate-400 text-sm py-4">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                      <th className="py-3 px-2 text-left">Vehicle</th>
                      <th className="py-3 px-2 text-left">Driver</th>
                      <th className="py-3 px-2 text-left">Trip</th>
                      <th className="py-3 px-2 text-left">Fuel (L)</th>
                      <th className="py-3 px-2 text-left">Cost/Unit</th>
                      <th className="py-3 px-2 text-left">Total Cost</th>
                      {user?.role === 'fleet_manager' && <th className="py-3 px-2 text-left">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/65">
                    {filteredFuelLogs.length > 0 ? filteredFuelLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition duration-150">
                        <td className="py-3.5 px-2 font-bold text-slate-800">{log.vehicle?.vehicle_name || '—'}</td>
                        <td className="py-3.5 px-2 font-semibold">{log.driver?.name || '—'}</td>
                        <td className="py-3.5 px-2 font-medium text-indigo-600">
                          {log.trip ? `${log.trip.source} → ${log.trip.destination}` : '—'}
                        </td>
                        <td className="py-3.5 px-2 font-medium">{log.fuel_amount} L</td>
                        <td className="py-3.5 px-2 font-medium">₹{log.cost_per_unit}</td>
                        <td className="py-3.5 px-2 font-bold text-slate-700">₹{log.total_cost?.toLocaleString()}</td>
                        {user?.role === 'fleet_manager' && (
                          <td className="py-3.5 px-2">
                            <button onClick={() => handleDeleteFuel(log.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer">Delete</button>
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr><td colSpan={user?.role === 'fleet_manager' ? 7 : 6} className="py-6 text-center text-slate-400 font-medium">No fuel logs found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* OTHER EXPENSES */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Other Expenses (Toll / Misc)</h3>
            {loading ? (
              <div className="text-slate-400 text-sm py-4">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                      <th className="py-3 px-2 text-left">Vehicle</th>
                      <th className="py-3 px-2 text-left">Type</th>
                      <th className="py-3 px-2 text-left">Amount</th>
                      <th className="py-3 px-2 text-left">Description</th>
                      {user?.role === 'fleet_manager' && <th className="py-3 px-2 text-left">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/65">
                    {filteredExpenses.length > 0 ? filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50 transition duration-150">
                        <td className="py-3.5 px-2 font-bold text-slate-800">{exp.vehicle?.vehicle_name || '—'}</td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold capitalize ${expTypeBadge(exp.expense_type)}`}>
                            {exp.expense_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 font-bold text-slate-700">₹{exp.amount?.toLocaleString()}</td>
                        <td className="py-3.5 px-2 font-medium text-slate-500">{exp.description || '—'}</td>
                        {user?.role === 'fleet_manager' && (
                          <td className="py-3.5 px-2">
                            <button onClick={() => handleDeleteExpense(exp.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer">Delete</button>
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr><td colSpan={user?.role === 'fleet_manager' ? 5 : 4} className="py-6 text-center text-slate-400 font-medium">No expenses found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="border-t border-slate-100 pt-6 mt-auto flex items-center justify-between bg-slate-50/40 rounded-2xl p-5 border border-slate-100">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Total Operational Cost (Lifetime) = Fuel + Expenses
          </span>
          <span className="text-2xl font-black text-[#FF6600]">
            ₹{totalOperationalCost.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Add Expense Details</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveExpense} className="space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</label>
                <select required value={expForm.vehicle_id} onChange={e => setExpForm({ ...expForm, vehicle_id: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none cursor-pointer">
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicle_name} ({v.registration_number})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expense Type</label>
                  <select value={expForm.expense_type} onChange={e => setExpForm({ ...expForm, expense_type: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none cursor-pointer">
                    <option value="toll">Toll</option>
                    <option value="repair">Repair</option>
                    <option value="service">Service</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount (₹)</label>
                  <input type="number" required placeholder="0" value={expForm.amount}
                    onChange={e => setExpForm({ ...expForm, amount: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <input type="text" placeholder="Optional note" value={expForm.description}
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition mt-6 cursor-pointer shadow-lg shadow-indigo-600/10">
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FuelExpensesTab
