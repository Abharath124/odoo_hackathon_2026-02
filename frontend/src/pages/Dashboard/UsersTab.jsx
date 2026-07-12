import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { showSuccess, showError } from '../../components/Toast/ToastProvider'

const ROLES = ['fleet_manager', 'driver', 'safety_officer', 'financial_analyst']

const roleBadge = (role) => {
  switch (role) {
    case 'fleet_manager':     return 'bg-indigo-50 text-indigo-600 border border-indigo-100'
    case 'driver':            return 'bg-blue-50 text-blue-600 border border-blue-100'
    case 'safety_officer':    return 'bg-amber-50 text-amber-600 border border-amber-100'
    case 'financial_analyst': return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    default:                  return 'bg-slate-100 text-slate-500'
  }
}

const roleLabel = (role) => role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

function UsersTab({ onProfileClick }) {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'driver' })

  const fetchUsers = () => {
    setLoading(true)
    api.get('/users')
      .then(setUsers)
      .catch(e => showError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const openCreate = () => {
    setEditUser(null)
    setForm({ name: '', email: '', password: '', role: 'driver' })
    setIsModalOpen(true)
  }

  const openEdit = (u) => {
    setEditUser(u)
    setForm({ name: u.name, email: u.email, password: '', role: u.role })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editUser) {
        // updateUser only accepts name and role
        await api.put(`/users/${editUser.id}`, { name: form.name, role: form.role })
        showSuccess('User updated successfully.')
      } else {
        await api.post('/users', { name: form.name, email: form.email, password: form.password, role: form.role })
        showSuccess('User created successfully.')
      }
      setIsModalOpen(false)
      fetchUsers()
    } catch (e) { showError(e.message) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      showSuccess('User deleted.')
      fetchUsers()
    } catch (e) { showError(e.message) }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <input
            type="text" placeholder="Search users..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition">
          <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100 capitalize">
            {user?.role?.replace(/_/g, ' ')}
          </span>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-600/20">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">User Management</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{users.length} users registered</p>
        </div>
        <button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm font-medium">Loading users...</div>
        ) : (
          <table className="w-full text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                <th className="py-3 px-2 text-left">#</th>
                <th className="py-3 px-2 text-left">Name</th>
                <th className="py-3 px-2 text-left">Email</th>
                <th className="py-3 px-2 text-left">Role</th>
                <th className="py-3 px-2 text-left">Verified</th>
                <th className="py-3 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/65">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition duration-150">
                  <td className="py-3.5 px-2 font-bold text-slate-400">{u.id}</td>
                  <td className="py-3.5 px-2 font-bold text-slate-800">{u.name}</td>
                  <td className="py-3.5 px-2 font-medium text-slate-500">{u.email}</td>
                  <td className="py-3.5 px-2">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${roleBadge(u.role)}`}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    {u.is_verified
                      ? <span className="text-emerald-600 font-bold text-xs">✓ Verified</span>
                      : <span className="text-rose-500 font-bold text-xs">✗ Unverified</span>}
                  </td>
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-slate-400 font-medium">No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">{editUser ? 'Edit User' : 'Create User'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
              </div>
              {!editUser && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. john@transitops.com"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="Min. 6 characters"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition" />
                  </div>
                </>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer">
                  {ROLES.map(r => <option key={r} value={r}>{roleLabel(r)}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition mt-2 cursor-pointer shadow-lg shadow-indigo-600/10">
                {editUser ? 'Save Changes' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersTab
