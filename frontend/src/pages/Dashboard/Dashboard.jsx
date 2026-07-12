import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'

function Dashboard() {
  const [activeNav, setActiveNav] = useState('Financial Analytics')
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-mesh-gradient p-6 flex gap-6 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={true}
        activeNav={activeNav}
        onNavClick={setActiveNav}
      />

      {/* Main Workspace Panel */}
      <div className="flex-1 bg-white rounded-[32px] p-8 shadow-2xl overflow-y-auto flex flex-col border border-white/80">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Created 10 Nov • Last modified 2 hours ago</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{activeNav}</h1>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Report</span>
          </button>
        </div>

        {/* Stat Cards Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: 'Fuel Efficiency',
              value: '8.4',
              unit: 'km/l',
              trend: 'up',
              color: 'text-emerald-500',
            },
            {
              label: 'Fleet Utilization',
              value: '87%',
              unit: '',
              trend: 'up',
              color: 'text-emerald-500',
            },
            {
              label: 'Operational Cost',
              value: '34,070',
              unit: 'USD',
              trend: 'down',
              color: 'text-rose-500',
            },
            {
              label: 'Vehicle ROI',
              value: '14.2%',
              unit: '',
              trend: 'up',
              color: 'text-emerald-500',
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50/50 border border-slate-100 rounded-[24px] p-5 flex flex-col justify-between hover:bg-slate-50 transition duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                {stat.trend === 'up' ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</span>
                {stat.unit && <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Middle Line Chart Section */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-[28px] p-6 mb-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Monthly Revenue vs. Cost</h2>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                <span>Data</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Cost</span>
              </div>
              <div className="relative">
                <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 outline-none hover:bg-slate-50 transition cursor-pointer">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </div>
          </div>

          {/* SVG line chart mock matching image layout */}
          <div className="w-full relative h-[280px]">
            <svg className="w-full h-full" viewBox="0 0 1000 280" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(14, 165, 233)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(14, 165, 233)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              <line x1="50" y1="20" x2="950" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="85" x2="950" y2="85" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="150" x2="950" y2="150" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="215" x2="950" y2="215" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="245" x2="950" y2="245" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="25" y="24" fill="#94a3b8" fontSize="11" textAnchor="end">2,000</text>
              <text x="25" y="89" fill="#94a3b8" fontSize="11" textAnchor="end">1,500</text>
              <text x="25" y="154" fill="#94a3b8" fontSize="11" textAnchor="end">1,000</text>
              <text x="25" y="219" fill="#94a3b8" fontSize="11" textAnchor="end">500</text>
              <text x="25" y="249" fill="#94a3b8" fontSize="11" textAnchor="end">0</text>

              {/* Area Under Curves */}
              <path d="M 50,150 C 130,130 210,95 290,110 S 450,120 530,95 S 690,140 770,30 S 890,65 950,25 L 950,245 L 50,245 Z" fill="url(#purpleGlow)" />
              <path d="M 50,200 C 130,180 210,130 290,140 S 450,120 530,110 S 690,105 770,80 S 890,40 950,45 L 950,245 L 50,245 Z" fill="url(#blueGlow)" />

              {/* Curve 1 (Purple - Data) */}
              <path 
                d="M 50,150 C 130,130 210,95 290,110 S 450,120 530,95 S 690,140 770,30 S 890,65 950,25" 
                fill="none" 
                stroke="rgb(99, 102, 241)" 
                strokeWidth="2.5" 
              />
              {/* Curve 2 (Blue - Intermediate) */}
              <path 
                d="M 50,200 C 130,180 210,130 290,140 S 450,120 530,110 S 690,105 770,80 S 890,40 950,45" 
                fill="none" 
                stroke="rgb(14, 165, 233)" 
                strokeWidth="2.5" 
              />
              {/* Curve 3 (Orange - Cost) */}
              <path 
                d="M 50,180 C 130,165 210,150 290,145 S 450,130 530,135 S 690,110 770,100 S 890,90 950,65" 
                fill="none" 
                stroke="rgb(245, 158, 11)" 
                strokeWidth="2.5" 
              />

              {/* Interactive Point Circles */}
              <circle cx="770" cy="30" r="4.5" fill="white" stroke="rgb(99, 102, 241)" strokeWidth="2.5" />
              <circle cx="770" cy="80" r="4.5" fill="white" stroke="rgb(14, 165, 233)" strokeWidth="2.5" />
              <circle cx="770" cy="100" r="4.5" fill="white" stroke="rgb(245, 158, 11)" strokeWidth="2.5" />
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between px-10 text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Bottom Section (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Costliest Vehicles */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-[28px] p-6 flex flex-col">
            <h2 className="text-base font-bold text-slate-800 mb-6 text-left">Top Costliest Vehicles</h2>
            <div className="space-y-5 flex-1 flex flex-col justify-center">
              {[
                { name: 'TRUCK-3', percentage: 80, val: '$8,420' },
                { name: 'VAN-02', percentage: 60, val: '$6,150' },
                { name: 'VAN-05', percentage: 40, val: '$4,100' },
              ].map((vehicle) => (
                <div key={vehicle.name} className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-600 w-16 text-left">{vehicle.name}</span>
                  <div className="flex-1 bg-slate-200/60 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${vehicle.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-12 text-right">{vehicle.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stacked Operations Cost Breakdown */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-[28px] p-6 flex flex-col">
            <h2 className="text-base font-bold text-slate-800 mb-4 text-left">Total Operations Cost Breakup (Fuel + Maintenance)</h2>
            <div className="flex items-end justify-between h-[160px] px-2 relative">
              
              {/* Stacked Chart Gridlines */}
              <div className="absolute left-0 right-0 top-0 border-t border-dashed border-slate-200" />
              <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-slate-200" />
              <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-slate-200" />
              
              {[
                { m: 'Jan', heights: [20, 30, 25] },
                { m: 'Feb', heights: [15, 20, 15] },
                { m: 'Mar', heights: [30, 35, 20] },
                { m: 'Apr', heights: [25, 25, 30] },
                { m: 'May', heights: [40, 20, 25] },
                { m: 'Jun', heights: [15, 25, 10] },
                { m: 'Jul', heights: [30, 30, 20] },
                { m: 'Aug', heights: [35, 40, 15] },
                { m: 'Sep', heights: [20, 25, 30] },
                { m: 'Oct', heights: [45, 30, 20] },
                { m: 'Nov', heights: [50, 35, 10] },
                { m: 'Dec', heights: [35, 25, 30] },
              ].map((col) => (
                <div key={col.m} className="flex flex-col items-center gap-1.5 h-full justify-end z-10">
                  <div className="w-5 flex flex-col justify-end h-[120px] rounded-[4px] overflow-hidden">
                    <div className="bg-amber-400" style={{ height: `${col.heights[2]}%` }} />
                    <div className="bg-indigo-500" style={{ height: `${col.heights[1]}%` }} />
                    <div className="bg-sky-400" style={{ height: `${col.heights[0]}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{col.m}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard
