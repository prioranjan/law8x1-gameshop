
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons, APP_NAME } from '../constants';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glassmorphism sticky top-0 z-50 border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center neon-border group-hover:scale-105 transition-transform">
              <span className="font-gaming font-bold text-xl">L8</span>
            </div>
            <span className="font-gaming font-bold text-lg hidden sm:inline-block tracking-tighter">
              {APP_NAME}
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="hover:text-blue-400 transition-colors text-sm font-medium">Home</Link>
            {user ? (
              <>
                <Link to="/orders" className="hover:text-blue-400 transition-colors text-sm font-medium">My Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-bold flex items-center gap-1">
                    <Icons.Settings />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-md text-xs font-bold transition-all border border-red-500/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold transition-all neon-border">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-white/10 mt-12 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p className="font-gaming text-sm mb-2">&copy; 2024 {APP_NAME}. All Rights Reserved.</p>
          <div className="flex justify-center gap-4 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
