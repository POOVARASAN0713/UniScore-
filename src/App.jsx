import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Semesters from './pages/Semesters';
import Login from './pages/Login';
import Register from './pages/Register';
import { Menu, GraduationCap, Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-955">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <span className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Loading UniScore...</span>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'register') {
      return (
        <div className="min-h-screen bg-gradient-to-tr from-indigo-500/5 via-slate-55 to-purple-500/5 dark:from-indigo-950/10 dark:via-slate-950 dark:to-purple-950/10 flex items-center justify-center">
          <Register setCurrentPage={setCurrentPage} />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-500/5 via-slate-55 to-purple-500/5 dark:from-indigo-950/10 dark:via-slate-950 dark:to-purple-950/10 flex items-center justify-center">
        <Login setCurrentPage={setCurrentPage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-955 flex transition-colors duration-300">
      
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 glass-panel sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg lg:hidden hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-505"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <GraduationCap className="w-6 h-6 text-indigo-500" />
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100 font-sans">UniScore</span>
            </div>
            <h2 className="hidden lg:block font-bold text-slate-700 dark:text-slate-300 capitalize font-sans">
              Welcome back, {user.name}!
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              Student Profile
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} />}
          {currentPage === 'semesters' && <Semesters />}
        </main>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
