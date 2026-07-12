import { useState } from 'react'

function ProfileTab() {
  const [name, setName] = useState('Raven K.')
  const [email, setEmail] = useState('raven@transitops.com')
  const [role, setRole] = useState('Dispatcher')
  const [language, setLanguage] = useState('English (US)')
  const [password, setPassword] = useState('••••••••••••')

  const handleSave = (e) => {
    e.preventDefault()
    alert('Profile settings saved successfully!')
  }

  return (
    <div className="flex flex-col text-left text-slate-800">
      
      {/* Top Search Bar Row */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">User Profile</h2>
        </div>

        {/* User profile detail badge */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">{name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">{role}</span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            RK
          </div>
        </div>
      </div>

      {/* Main split profile card layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 w-full flex flex-col items-center shadow-sm">
            <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center font-black text-4xl text-white shadow-xl shadow-blue-500/25 mb-4 border-4 border-white">
              RK
            </div>
            <h3 className="text-lg font-bold text-slate-800">{name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{role}</p>
            
            <div className="mt-6 flex flex-col gap-2 w-full">
              <button className="bg-indigo-600 hover:bg-indigo-755 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md shadow-indigo-600/10">
                Upload New Photo
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer">
                Remove Photo
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Account details form */}
        <div className="lg:col-span-8">
          <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 block">Account Information</h3>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50 transition cursor-pointer"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-755 text-white font-bold py-3 px-6 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>
  )
}

export default ProfileTab
