import { useState } from 'react'

// Initial fuel logs mock data
const initialFuelLogs = [
  { vehicle: 'VAN-05', date: '05 Jul 2026', liters: '45 L', cost: 3150 },
  { vehicle: 'TRUCK-11', date: '06 Jul 2026', liters: '110 L', cost: 8400 },
  { vehicle: 'MINI-03', date: '06 Jul 2026', liters: '28 L', cost: 2050 },
]

// Initial other expenses mock data
const initialOtherExpenses = [
  { trip: 'TR001', vehicle: 'VAN-05', toll: 120, other: 0, maint: 0, status: 'Available' },
  { trip: 'TR002', vehicle: 'TRX-12', toll: 340, other: 180, maint: 18000, status: 'Completed' },
]

function FuelExpensesTab({ onProfileClick }) {
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs)
  const [expenses, setExpenses] = useState(initialOtherExpenses)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal open states
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)

  // Form states - Log Fuel
  const [fuelVehicle, setFuelVehicle] = useState('VAN-05')
  const [fuelDate, setFuelDate] = useState('07 Jul 2026')
  const [fuelLiters, setFuelLiters] = useState('45')
  const [fuelCost, setFuelCost] = useState('3150')

  // Form states - Add Expense
  const [expTrip, setExpTrip] = useState('TR003')
  const [expVehicle, setExpVehicle] = useState('VAN-05')
  const [expToll, setExpToll] = useState('120')
  const [expOther, setExpOther] = useState('0')
  const [expMaint, setExpMaint] = useState('0')
  const [expStatus, setExpStatus] = useState('Available')

  // Dynamic calculations for bottom panel
  const totalFuelCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0)
  const totalOtherExpenses = expenses.reduce((sum, exp) => sum + exp.toll + exp.other + exp.maint, 0)
  const totalOperationalCost = totalFuelCost + totalOtherExpenses

  // Search filtering
  const filteredFuelLogs = fuelLogs.filter(log =>
    log.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.date.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredExpenses = expenses.filter(exp =>
    exp.trip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle Save Fuel Log
  const handleSaveFuel = (e) => {
    e.preventDefault()
    if (!fuelLiters || !fuelCost || !fuelDate) {
      alert("All fields are required.")
      return
    }

    const newLog = {
      vehicle: fuelVehicle,
      date: fuelDate,
      liters: fuelLiters.endsWith('L') ? fuelLiters : `${fuelLiters} L`,
      cost: parseFloat(fuelCost) || 0
    }

    setFuelLogs([newLog, ...fuelLogs])
    setIsFuelModalOpen(false)

    // Reset Form
    setFuelLiters('')
    setFuelCost('')
  }

  // Handle Save Expense Line
  const handleSaveExpense = (e) => {
    e.preventDefault()
    if (!expTrip || !expVehicle || !expToll || !expOther || !expMaint) {
      alert("All fields are required.")
      return
    }

    const newExp = {
      trip: expTrip,
      vehicle: expVehicle,
      toll: parseFloat(expToll) || 0,
      other: parseFloat(expOther) || 0,
      maint: parseFloat(expMaint) || 0,
      status: expStatus
    }

    setExpenses([newExp, ...expenses])
    setIsExpenseModalOpen(false)

    // Reset Form
    setExpToll('0')
    setExpOther('0')
    setExpMaint('0')
  }

  const getStatusBadge = (val) => {
    if (val === 'Available') {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    }
    return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
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
            placeholder="Search records..."
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

      {/* Header title & Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Fuel &amp; Expense Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFuelModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Log Fuel</span>
          </button>
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

      {/* Main Content Layout */}
      <div className="space-y-8 flex-1 flex flex-col justify-between">
        
        <div className="space-y-8">
          {/* FUEL LOGS Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Fuel Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    <th className="py-3 px-2 text-left">Vehicle</th>
                    <th className="py-3 px-2 text-left">Date</th>
                    <th className="py-3 px-2 text-left">Liters</th>
                    <th className="py-3 px-2 text-left">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/65">
                  {filteredFuelLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition duration-150">
                      <td className="py-3.5 px-2 font-bold text-slate-800">{log.vehicle}</td>
                      <td className="py-3.5 px-2 font-semibold">{log.date}</td>
                      <td className="py-3.5 px-2 font-medium">{log.liters}</td>
                      <td className="py-3.5 px-2 font-bold text-slate-700">{log.cost.toLocaleString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* OTHER EXPENSES Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Other Expenses (Toll / Misc)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    <th className="py-3 px-2 text-left">Trip</th>
                    <th className="py-3 px-2 text-left">Vehicle</th>
                    <th className="py-3 px-2 text-left">Toll</th>
                    <th className="py-3 px-2 text-left">Other</th>
                    <th className="py-3 px-2 text-left">Maint. (Closed)</th>
                    <th className="py-3 px-2 text-left">Total/Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/65">
                  {filteredExpenses.map((exp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition duration-150">
                      <td className="py-3.5 px-2 font-bold text-indigo-600">{exp.trip}</td>
                      <td className="py-3.5 px-2 font-bold text-slate-800">{exp.vehicle}</td>
                      <td className="py-3.5 px-2 font-semibold">{exp.toll.toLocaleString()}</td>
                      <td className="py-3.5 px-2 font-semibold">{exp.other.toLocaleString()}</td>
                      <td className="py-3.5 px-2 font-semibold">{exp.maint.toLocaleString()}</td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-block w-24 text-center py-1.5 rounded-lg text-xs font-bold ${getStatusBadge(exp.status)}`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dynamic bottom cost summary */}
        <div className="border-t border-slate-100 pt-6 mt-auto flex items-center justify-between bg-slate-50/40 rounded-2xl p-5 border border-slate-100">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Total Operational Cost (Lifetime) = Fuel + Maintenance
          </span>
          <span className="text-2xl font-black text-[#FF6600]">
            {totalOperationalCost.toLocaleString('en-US')}
          </span>
        </div>

      </div>

      {/* Log Fuel Modal */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Log Fuel Entry</h3>
              <button
                onClick={() => setIsFuelModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveFuel} className="space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</label>
                <select
                  value={fuelVehicle}
                  onChange={(e) => setFuelVehicle(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  <option value="VAN-05">VAN-05</option>
                  <option value="TRUCK-11">TRUCK-11</option>
                  <option value="MINI-03">MINI-03</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 05 Jul 2026"
                  value={fuelDate}
                  onChange={(e) => setFuelDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Liters</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 45"
                  value={fuelLiters}
                  onChange={(e) => setFuelLiters(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cost ($)</label>
                <input
                  type="number"
                  required
                  placeholder="Total amount in USD"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3 rounded-xl text-sm transition mt-6 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                Log Fuel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col text-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">Add Expense Details</h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trip</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TR003"
                    value={expTrip}
                    onChange={(e) => setExpTrip(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</label>
                  <select
                    value={expVehicle}
                    onChange={(e) => setExpVehicle(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                  >
                    <option value="VAN-05">VAN-05</option>
                    <option value="TRX-12">TRX-12</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toll</label>
                  <input
                    type="number"
                    required
                    value={expToll}
                    onChange={(e) => setExpToll(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Other</label>
                  <input
                    type="number"
                    required
                    value={expOther}
                    onChange={(e) => setExpOther(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maint.</label>
                  <input
                    type="number"
                    required
                    value={expMaint}
                    onChange={(e) => setExpMaint(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <select
                  value={expStatus}
                  onChange={(e) => setExpStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3 rounded-xl text-sm transition mt-6 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
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
