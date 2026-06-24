import React from 'react';
import { LayoutDashboard, GraduationCap, LogOut, Sun, Moon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }) {
  const { user, logout, theme, toggleTheme } = useAuth();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'semesters', name: 'Semesters', icon: GraduationCap },
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 transform glass-panel lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-sans">UniScore</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg lg:hidden hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-md shadow-indigo-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</h4>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-450 border-l-4 border-indigo-500 pl-3' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Bottom Control Bar */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-800/30 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-350'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-455 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}
