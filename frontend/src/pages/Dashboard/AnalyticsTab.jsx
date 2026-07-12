import { useAuth } from '../../context/AuthContext'

function AnalyticsTab({ onProfileClick }) {
  const { user } = useAuth()
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

      {/* Stat Cards Grid (4 columns) with matching left-borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Fuel Efficiency', value: '8.4 km/l', borderColor: 'border-l-blue-500' },
          { label: 'Fleet Utilization', value: '81%', borderColor: 'border-l-emerald-500' },
          { label: 'Operational Cost', value: '34,070', borderColor: 'border-l-amber-500' },
          { label: 'Vehicle ROI', value: '14.2%', borderColor: 'border-l-emerald-500' },
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
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Monthly Revenue</h3>
          
          <div className="flex items-end justify-between h-[180px] bg-slate-50/50 border border-slate-100 rounded-2xl p-5 relative">
            <div className="absolute left-0 right-0 top-0 border-t border-dashed border-slate-200" />
            <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-slate-200" />
            <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-slate-200" />

            {[
              { m: 'Jan', val: '40%' },
              { m: 'Feb', val: '55%' },
              { m: 'Mar', val: '50%' },
              { m: 'Apr', val: '70%' },
              { m: 'May', val: '65%' },
              { m: 'Jun', val: '85%' },
              { m: 'Jul', val: '80%' },
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end z-10 w-12">
                <div 
                  className="bg-blue-500/80 hover:bg-blue-600 rounded-md w-full transition-all duration-300"
                  style={{ height: col.val }}
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase">{col.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Top Costliest Vehicles (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Top Costliest Vehicles</h3>
          
          <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-6 space-y-6">
            {[
              { name: 'TRUCK-11', percent: 85, color: 'bg-rose-400/90' },
              { name: 'MINI-03', percent: 40, color: 'bg-amber-500' },
              { name: 'VAN-05', percent: 15, color: 'bg-blue-500' },
            ].map((vehicle, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 text-left">
                <span className="text-xs font-bold text-slate-600">{vehicle.name}</span>
                <div className="w-full bg-slate-200/60 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`${vehicle.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${vehicle.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default AnalyticsTab
