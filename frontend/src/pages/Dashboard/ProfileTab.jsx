import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'

const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const roleLabel = (role = '') =>
  role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

function ProfileTab() {
  const { user, login } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return showError('Name cannot be empty.')
    try {
      setSaving(true)
      const res = await api.put(`/users/${user.id}`, { name: name.trim(), role: user.role })
      // Update auth context with new name (re-use existing token)
      login({ token: user.token, user: res.user })
      showSuccess('Profile updated successfully.')
    } catch (err) {
      showError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col text-left text-slate-800">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">User Profile</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 capitalize">
            {roleLabel(user?.role)}
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-600/20">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">

        {/* Left: Avatar Card */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 w-full flex flex-col items-center shadow-sm">
            <div className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center font-black text-4xl text-white shadow-xl shadow-indigo-500/25 mb-4 border-4 border-white">
              {getInitials(user?.name)}
            </div>
            <h3 className="text-lg font-bold text-slate-800">{user?.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{roleLabel(user?.role)}</p>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>

            <div className="mt-6 w-full bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-wider">User ID</span>
                <span className="text-slate-700">#{user?.id}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-wider">Role</span>
                <span className="text-indigo-600">{roleLabel(user?.role)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-wider">Status</span>
                <span className="text-emerald-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Account Form */}
        <div className="lg:col-span-8">
          <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Account Information</h3>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name — editable */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {/* Email — read only */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email" readOnly value={user?.email || ''}
                    className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-500 outline-none cursor-not-allowed"
                  />
                  <span className="text-[9px] text-slate-400 font-medium">Email cannot be changed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role — read only */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</label>
                  <input
                    type="text" readOnly value={roleLabel(user?.role)}
                    className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-500 outline-none cursor-not-allowed"
                  />
                  <span className="text-[9px] text-slate-400 font-medium">Role is managed by Fleet Manager</span>
                </div>

                {/* User ID — read only */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User ID</label>
                  <input
                    type="text" readOnly value={`#${user?.id}`}
                    className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setName(user?.name || '')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-xl text-xs transition cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit" disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-indigo-600/10 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
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
