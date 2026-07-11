import { useAuth } from "../context/AuthContext";

function Navbar({ activeNav, onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="text-gray-500 hover:text-indigo-600 transition cursor-pointer"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Page Title */}
      <h2 className="text-base font-semibold text-gray-700">{activeNav}</h2>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 hidden sm:block">
          Hello, {user?.name || "User"} 👋
        </span>
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
