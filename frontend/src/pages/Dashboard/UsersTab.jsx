import { useState } from 'react'

const initialUsers = [
  { id: 1, name: 'Jonathan Hope', email: 'jonathan@transitops.com', role: 'fleet_manager', is_verified: true },
  { id: 2, name: 'Raven K.', email: 'raven@transitops.com', role: 'safety_officer', is_verified: true },
  { id: 3, name: 'Alex D.', email: 'alex@transitops.com', role: 'financial_analyst', is_verified: true },
]

const ROLES = ['fleet_manager', 'driver', 'safety_officer', 'financial_analyst']

const roleBadge = (role) => {
  switch (role) {
    case 'fleet_manager': return 'bg-indigo-50 text-indigo-600 border border-indigo-100'
    case 'driver': return 'bg-blue-50 text-blue-600 border border-blue-100'
    case 'safety_officer': return 'bg-amber-50 text-amber-600 border border-amber-100'
    case 'financial_analyst': return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    default: return 'bg-slate-100 text-slate-500'
  }
}

const roleLabel = (role) => role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

function UsersTab({ onProfileClick }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null) // null = create mode, object = edit mode

  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState('driver')

  const openCreate = () => {
    setEditUser(null)
    setFormName('')
    setFormEmail('')
    setFormPassword('')
    setFormRole('driver')
    setIsModalOpen(true)
  }

  const openEdit = (user) => {
    setEditUser(user)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormPassword('')
    setFormRole(user.role)
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, name: formName, role: formRole } : u))
    } else {
      const newUser = {
        id: users.length + 1,
        name: formName,
        email: formEmail,
        role: formRole,
        is_verified: true,
      }
      setUsers([...users, newUser])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this user?')) return
    setUsers(users.filter(u => u.id !== id))
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
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
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>
        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition">
          <span className="text-sm font-semibold text-slate-700"></span>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100">Admin</span>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-600/20">FM</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">User Management</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{users.length} users registered</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
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
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition duration-150">
                <td className="py-3.5 px-2 font-bold text-slate-400">{user.id}</td>
                <td className="py-3.5 px-2 font-bold text-slate-800">{user.name}</td>
                <td className="py-3.5 px-2 font-medium text-slate-500">{user.email}</td>
                <td className="py-3.5 px-2">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${roleBadge(user.role)}`}>
                    {roleLabel(user.role)}
                  </span>
                </td>
                <td className="py-3.5 px-2">
                  {user.is_verified
                    ? <span className="text-emerald-600 font-bold text-xs">✓ Verified</span>
                    : <span className="text-rose-500 font-bold text-xs">✗ Unverified</span>}
                </td>
                <td className="py-3.5 px-2 flex items-center gap-2">
                  <button
                    onClick={() => openEdit(user)}
                    className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight">{editUser ? 'Edit User' : 'Create User'}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text" required value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {!editUser && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                    <input
                      type="email" required value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. john@transitops.com"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <input
                      type="password" required value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  {ROLES.map(r => <option key={r} value={r}>{roleLabel(r)}</option>)}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition mt-2 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
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
