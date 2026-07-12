import { useNavigate } from "react-router-dom";
import { showSuccess } from "./Toast/ToastProvider";
import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 14a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    ),
  },
  {
    label: "Fleet",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.32-5.126c-.035-.563-.506-.998-1.07-1.002H18.75m-6.75 6.75H12V3.75h6.75a.75.75 0 01.75.75v13.5H12zM2.25 14.25h16.5M6 6H3v4h3V6zm0 0H3" />
      </svg>
    ),
  },
  {
    label: "Trips",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-3.46c.866-.526 1.497-1.442 1.497-2.54 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.098.63 2.014 1.497 2.54M9 15h6M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5A1.125 1.125 0 0020.625 3.75H3.375A1.125 1.125 0 002.25 4.875v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: "Maintenance",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83m-3.75 3.75a2.25 2.25 0 113.75-3.75M9 6c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 0v10m-3-7v4m0 0a2 2 0 104 0V9m-4 4v2.5M6 18c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm0 0h12" />
      </svg>
    ),
  },
  {
    label: "Financial Analytics",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function Sidebar({ isOpen, activeNav, onNavClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully!");
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between text-white shadow-2xl shrink-0">
      <div className="flex flex-col">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 px-2 py-3">
          {/* Logo icon */}
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide text-white">TransitOps</span>
        </div>

        {/* User Card */}
        <div className="bg-black/20 hover:bg-black/30 transition border border-white/5 rounded-2xl p-3 flex items-center justify-between mt-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" 
              alt="User Profile" 
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            <div className="text-left">
              <h4 className="text-sm font-semibold leading-tight text-white">{user?.name || 'Jonathan Hope'}</h4>
              <p className="text-xs text-white/50">{user?.email || 'lopa@gmail.com'}</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5 mt-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavClick(item.label)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeNav === item.label
                  ? "bg-white/15 border border-white/10 text-white shadow-lg shadow-black/5"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`transition-transform duration-200 ${activeNav === item.label ? 'scale-110 text-indigo-300' : 'text-white/60'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
