import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function AnalyticsTab({ onProfileClick }) {
  const { user } = useAuth()
  const [fuelReport, setFuelReport] = useState([])
  const [costReport, setCostReport] = useState([])
  const [utilizationReport, setUtilizationReport] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [fuel, cost, util] = await Promise.all([
        api.get('/reports/fuel-efficiency'),
        api.get('/reports/operational-cost'),
        api.get('/reports/fleet-utilization')
      ])
      setFuelReport(fuel)
      setCostReport(cost)
      setUtilizationReport(util)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculations
  const avgFuelEfficiency = fuelReport.length > 0
    ? (fuelReport.reduce((acc, curr) => acc + (parseFloat(curr.fuel_efficiency) || 0), 0) / fuelReport.length).toFixed(1)
    : '0.0'

  const totalTripsCount = utilizationReport.reduce((acc, curr) => acc + (parseInt(curr.trips_count) || 0), 0)

  const totalCost = costReport.reduce((acc, curr) => acc + (parseFloat(curr.total_operational_cost) || 0), 0)

  const totalDistance = utilizationReport.reduce((acc, curr) => acc + (parseFloat(curr.total_distance) || 0), 0)
  const avgDistance = utilizationReport.length > 0 ? (totalDistance / utilizationReport.length).toFixed(0) : '0'

  // Sort costiest vehicles
  const costliestVehicles = [...costReport]
    .sort((a, b) => b.total_operational_cost - a.total_operational_cost)
    .slice(0, 3)

  const maxOperationalCost = costliestVehicles.length > 0 ? costliestVehicles[0].total_operational_cost : 1

  return (
    <div className="flex flex-col text-left text-slate-800">
      
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
            placeholder="Search reports..."
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

      {/* Header and Title */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Reports &amp; Analytics</h2>
      </div>

      {loading ? (
        <div className="text-slate-400 font-medium py-8 text-center">Loading Analytics Reports...</div>
      ) : (
        <>
          {/* Stat Cards Grid (4 columns) with matching left-borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Avg Fuel Efficiency', value: `${avgFuelEfficiency} km/l`, borderColor: 'border-l-blue-500' },
              { label: 'Total Trips Logged', value: `${totalTripsCount}`, borderColor: 'border-l-emerald-500' },
              { label: 'Fleet Operational Cost', value: `$${totalCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`, borderColor: 'border-l-amber-500' },
              { label: 'Avg Distance / Vehicle', value: `${avgDistance} km`, borderColor: 'border-l-emerald-500' },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`bg-slate-50/60 border border-slate-100 rounded-xl p-5 text-left border-l-4 ${card.borderColor} shadow-sm`}
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{card.label}</p>
                <p className="text-2xl font-black tracking-tight text-slate-800">{card.value}</p>
              </div>
            ))}
          </div>

          {/* ROI Description Notice */}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">
            ROI = (Revenue - Maintenance - Fuel) / Acquisition Cost
          </div>

          {/* Bottom Main Content split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
            
            {/* Left Side: Monthly Revenue Column Chart (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-start">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Vehicle Operational Cost Proportions</h3>
              
              <div className="flex items-end justify-between h-[180px] bg-slate-50/50 border border-slate-100 rounded-2xl p-5 relative">
                <div className="absolute left-0 right-0 top-0 border-t border-dashed border-slate-200" />
                <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-slate-200" />
                <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-slate-200" />

                {costReport.slice(0, 7).map((col, idx) => {
                  const percent = maxOperationalCost > 0 ? (col.total_operational_cost / maxOperationalCost) * 100 : 0
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end z-10 w-12" title={`$${col.total_operational_cost}`}>
                      <div 
                        className="bg-blue-500/80 hover:bg-blue-600 rounded-md w-full transition-all duration-300"
                        style={{ height: `${percent}%` }}
                      />
                      <span className="text-[9px] font-bold text-slate-400 uppercase truncate w-12 text-center">{col.vehicle_name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Side: Top Costliest Vehicles (col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Top Costliest Vehicles</h3>
              
              <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-6 space-y-6">
                {costliestVehicles.map((vehicle, idx) => {
                  const percent = maxOperationalCost > 0 ? (vehicle.total_operational_cost / maxOperationalCost) * 100 : 0
                  const colors = ['bg-rose-400/90', 'bg-amber-500', 'bg-blue-500']
                  return (
                    <div key={idx} className="flex flex-col gap-1.5 text-left">
                      <div className="flex justify-between text-xs font-bold text-slate-650">
                        <span>{vehicle.vehicle_name}</span>
                        <span>${vehicle.total_operational_cost.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200/60 h-3 rounded-full overflow-hidden">
                        <div 
                          className={`${colors[idx % colors.length]} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  )
}

export default AnalyticsTab
