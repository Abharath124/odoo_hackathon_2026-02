import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

function DashboardTab({ onProfileClick }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState('')

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(setStats)
      .catch(e => setStatsError(e.message))
  }, [])

  // Timeline list
  const timelineItems = [
    { time: '09:42', vehicle: 'VAN-07', status: 'On Trip', driver: 'Marcus Chen', route: 'Downtown - Airport', eta: '14 min' },
    { time: '09:38', vehicle: 'BUS-02', status: 'Completed', driver: 'Sarah Kim', route: 'North Hub - Central', eta: 'Done' },
    { time: '09:31', vehicle: 'TRK-03', status: 'On Trip', driver: 'James Rivera', route: 'Warehouse - Mall', eta: '28 min' },
    { time: '09:15', vehicle: 'VAN-12', status: 'Dispatched', driver: 'Elena Vasquez', route: 'Port - Industrial Zone', eta: '45 min' },
  ]

  // Driver Safety Scores
  const driverSafety = [
    { name: 'Marcus Chen', score: 94, status: 'On Trip' },
    { name: 'Sarah Kim', score: 91, status: 'Available' },
    { name: 'James Rivera', score: 87, status: 'On Trip' },
    { name: 'Elena Vasquez', score: 96, status: 'Dispatched' },
  ]

  // AI Insights
  const insights = [
    { type: 'Maintenance Alert', desc: 'VAN-05 is 240km overdue for oil change. Schedule within 48h.', color: 'border-l-amber-500 bg-amber-50/30' },
    { type: 'Fuel Efficiency Up', desc: 'Fleet efficiency improved 7.3% this week via optimized routing.', color: 'border-l-emerald-500 bg-emerald-50/30' },
    { type: 'License Expiry', desc: "Driver Rivera's commercial license expires in 12 days. Renewal required.", color: 'border-l-rose-500 bg-rose-50/30' },
  ]

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
            placeholder="Search anything..."
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

      {/* Greeting Row */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Good morning, {user?.name?.split(' ')[0]} 👏</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Sunday, July 12, 2026 • Here's your fleet at a glance.</p>
        </div>

        {/* Top actions quick buttons */}
        <div className="flex gap-2">
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer">
            + New Trip
          </button>
          <button className="bg-slate-100 hover:bg-slate-250 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-250/70">
            Add Driver
          </button>
          <button className="bg-slate-100 hover:bg-slate-250 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-250/70">
            Fuel Entry
          </button>
          <button className="bg-slate-100 hover:bg-slate-250 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-250/70">
            Service
          </button>
        </div>
      </div>

      {/* Main Grid: Fleet Health (Left) + Stats Cards Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Fleet Health Card (col-span-4) */}
        <div className="lg:col-span-4 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Fleet Health</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Overall condition score</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
          </div>

          {/* Radial Graph */}
          <div className="flex justify-center items-center my-6 relative">
            <svg className="w-32 h-32" viewBox="0 0 36 36">
              <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500" strokeDasharray={`${stats ? stats.fleetUtilization.toFixed(0) : 0}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black tracking-tight text-slate-800">{stats ? stats.fleetUtilization.toFixed(0) : '—'}</span>
              <span className="text-[9px] font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="text-center">
            <span className="inline-block bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 mb-4">
              +3 vs last week
            </span>
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 block">{stats ? stats.availableVehicles : '—'}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Available</span>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-500 block">{stats ? stats.vehiclesOnTrip : '—'}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">On Trip</span>
              </div>
              <div>
                <span className="text-xs font-bold text-rose-500 block">{stats ? stats.vehiclesInShop : '—'}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">In Shop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small stats cards grid (col-span-8) */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: stats ? stats.totalVehicles : '—', desc: 'Total Vehicles', trend: '', trendColor: 'text-emerald-500', sparkColor: '#3b82f6' },
            { val: stats ? stats.availableVehicles : '—', desc: 'Available Now', trend: '', trendColor: 'text-emerald-500', sparkColor: '#10b981' },
            { val: stats ? stats.vehiclesInShop : '—', desc: 'In Maintenance', trend: '', trendColor: 'text-rose-500', sparkColor: '#f59e0b' },
            { val: stats ? stats.activeTrips : '—', desc: 'Active Trips', trend: '', trendColor: 'text-emerald-500', sparkColor: '#8b5cf6' },
            { val: stats ? stats.totalDrivers : '—', desc: 'Total Drivers', trend: '', trendColor: 'text-emerald-500', sparkColor: '#6366f1' },
            { val: stats ? stats.availableDrivers : '—', desc: 'Drivers Available', trend: '', trendColor: 'text-emerald-500', sparkColor: '#d97706' },
            { val: stats ? stats.pendingTrips : '—', desc: 'Pending Trips', trend: '', trendColor: 'text-amber-500', sparkColor: '#10b981' },
            { val: stats ? stats.completedTrips : '—', desc: 'Completed Trips', trend: '', trendColor: 'text-emerald-500', sparkColor: '#ef4444' },
          ].map((card, idx) => (
            <div key={idx} className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="uppercase tracking-wider truncate mr-1">{card.desc}</span>
                <span className={card.trendColor}>{card.trend}</span>
              </div>
              <div className="text-xl font-black text-slate-800 tracking-tight my-2">
                {card.val}
              </div>
              {/* Sparkline mini-graph SVG mock */}
              <div className="h-6 w-full">
                <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path
                    d={`M 0,20 Q 25,${5 + (idx % 3) * 6} 50,15 T 100,${10 + (idx % 2) * 5}`}
                    fill="none"
                    stroke={card.sparkColor}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Middle Grid: Live Fleet Map (Left) + AI Insights (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Map Placeholder (col-span-8) */}
        <div className="lg:col-span-8 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Live Fleet Map</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Real-time vehicle positions</p>
            </div>
            
            <button className="bg-white border border-slate-200 text-slate-600 rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
              <span>Filter</span>
            </button>
          </div>

          {/* Nairobi Map Plot dots */}
          <div className="bg-slate-200/50 rounded-2xl h-[280px] w-full relative overflow-hidden border border-slate-100">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/36.8219,-1.2921,11,0/800x280?access_token=mock')" }} />
            
            {/* Nairobi Live label */}
            <span className="absolute top-4 right-4 bg-emerald-500 text-white font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Live - Nairobi</span>
            </span>

            {/* Simulated Vehicles Map Markers */}
            <div className="absolute top-1/4 left-1/3 w-4.5 h-4.5 bg-blue-500 rounded-full border-2 border-white shadow-md animate-bounce" title="VAN-07 - On Trip" />
            <div className="absolute top-1/2 left-2/3 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white shadow-md" title="BUS-02 - Available" />
            <div className="absolute bottom-1/3 left-1/2 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white shadow-md animate-ping" />
            <div className="absolute bottom-1/3 left-1/2 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white shadow-md" title="BUS-05 - Available" />
            <div className="absolute top-2/3 left-1/4 w-4.5 h-4.5 bg-amber-500 rounded-full border-2 border-white shadow-md" title="VAN-12 - Dispatched" />

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-150 p-3 rounded-xl text-[10px] font-bold space-y-1.5 shadow-md">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" /><span>On Trip</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" /><span>Available</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" /><span>Dispatched</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" /><span>Maintenance</span></div>
            </div>
          </div>
        </div>

        {/* AI Insights Card (col-span-4) */}
        <div className="lg:col-span-4 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-4.5 h-4.5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15.187m6-1.184V3a1 1 0 011-1h.043a1 1 0 011 1v10.813M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
              </svg>
              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">AI Insights</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">4 recommendations</p>
          </div>

          <div className="space-y-4 flex-1">
            {insights.map((ins, idx) => (
              <div key={idx} className={`border-l-4 p-3.5 rounded-2xl text-[11px] font-medium leading-relaxed border border-slate-100/70 shadow-sm ${ins.color}`}>
                <span className="font-extrabold text-slate-700 block mb-1">{ins.type}</span>
                <span className="text-slate-500">{ins.desc}</span>
              </div>
            ))}
          </div>

          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-755 mt-4 text-center block w-full transition">
            View all recommendations &rarr;
          </button>
        </div>

      </div>

      {/* Bottom Grid: Live Dispatch Timeline (Left) + Driver Safety Scores (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Live Dispatch Timeline */}
        <div className="lg:col-span-7 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-6">Live Dispatch Timeline</h3>
          
          <div className="space-y-4">
            {timelineItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-100/50 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400">{item.time}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{item.vehicle}</span>
                    <span className="text-[10px] font-semibold text-slate-400 block">{item.driver} &bull; {item.route}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'On Trip' ? 'bg-blue-50 text-blue-600 border border-blue-100' : item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{item.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Safety Scores */}
        <div className="lg:col-span-5 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-6">Driver Safety Scores</h3>
          
          <div className="space-y-4">
            {driverSafety.map((driver, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-xs text-indigo-600 border border-indigo-100">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate">{driver.name}</span>
                </div>

                <div className="flex-1 bg-slate-200/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${driver.score}%` }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-800 w-8 text-right">{driver.score}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottommost Grid: Fuel Efficiency Trend (Left) + Maintenance Schedule (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Fuel Efficiency Trend (col-span-7) */}
        <div className="lg:col-span-7 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Fuel Efficiency Trend</h3>
              <p className="text-[10px] text-slate-400 font-semibold">L/100km - Jan-Jul 2026</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <span>&uarr; 7.3% this month</span>
            </span>
          </div>

          {/* SVG line chart */}
          <div className="w-full h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              <path 
                d="M 0,90 Q 60,85 120,70 T 240,65 T 360,50 T 400,40" 
                fill="none" 
                stroke="rgb(59, 130, 246)" 
                strokeWidth="2.5" 
              />
              <path 
                d="M 0,90 Q 60,85 120,70 T 240,65 T 360,50 T 400,40 L 400,120 L 0,120 Z" 
                fill="url(#sparkGlow)" 
                opacity="0.1" 
              />
              <defs>
                <linearGradient id="sparkGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                  <stop offset="100%" stopColor="white" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Legend months */}
            <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase mt-2 px-1">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>
        </div>

        {/* Maintenance Schedule (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-50/60 border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Maintenance Schedule</h3>
            <span className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer">+ Schedule</span>
          </div>

          <div className="space-y-4">
            {[
              { vehicle: 'VAN-03', service: 'Oil Change', driver: 'Tony Bravo', date: 'Jul 14', cost: '$280', status: 'Scheduled', statusColor: 'text-blue-500' },
              { vehicle: 'TRK-02', service: 'Brake Service', driver: 'Maria Santos', date: 'Jul 15', cost: '$840', status: 'Scheduled', statusColor: 'text-blue-500' },
              { vehicle: 'BUS-01', service: 'Full Inspection', driver: 'Tony Bravo', date: 'Jul 17', cost: '$1200', status: 'Pending', statusColor: 'text-amber-500' },
              { vehicle: 'VAN-08', service: 'Tire Rotation', driver: 'Lee Chang', date: 'Jul 19', cost: '$160', status: 'Scheduled', statusColor: 'text-blue-500' },
            ].map((sched, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-100/50 pb-2.5 last:border-0 last:pb-0">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">{sched.vehicle}</span>
                  <span className="text-[10px] font-semibold text-slate-400 block">{sched.service} &bull; {sched.driver}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-700 block">{sched.cost}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${sched.statusColor}`}>{sched.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default DashboardTab
