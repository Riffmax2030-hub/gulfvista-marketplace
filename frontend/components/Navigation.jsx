import React from 'react';

export default function Navigation({ user, onLogout, onNavClick }) {
  return (
    <nav className="bg-slate-950 border-b border-amber-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavClick('home')}
        >
          <span className="text-2xl font-bold text-amber-500">✨</span>
          <h1 className="text-xl font-bold text-white">gulfvista</h1>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavClick('home')}
            className="text-gray-300 hover:text-amber-500 transition"
          >
            Properties
          </button>

          {user ? (
            <>
              <button
                onClick={() => onNavClick('dashboard')}
                className="text-gray-300 hover:text-amber-500 transition"
              >
                Dashboard
              </button>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">{user.email}</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavClick('login')}
                className="px-4 py-2 text-amber-500 border border-amber-500 rounded hover:bg-amber-500/10 transition"
              >
                Login
              </button>
              <button
                onClick={() => onNavClick('register')}
                className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
