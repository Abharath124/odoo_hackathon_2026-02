import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

function Dashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        activeNav={activeNav}
        onNavClick={setActiveNav}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar */}
        <Navbar
          activeNav={activeNav}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white mb-6">
            <h3 className="text-xl font-bold mb-1">Welcome back, {user?.name || 'User'}! 👋</h3>
            <p className="text-indigo-100 text-sm">Here's what's happening with your app today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Users',      value: '1,024', textColor: 'text-blue-600' },
              { label: 'Active Sessions',  value: '38',    textColor: 'text-green-600' },
              { label: 'Pending Tasks',    value: '5',     textColor: 'text-yellow-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}

export default Dashboard
