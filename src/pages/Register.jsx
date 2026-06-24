import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, Mail, Lock, AlertCircle, Loader } from 'lucide-react';

export default function Register({ setCurrentPage }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);

    if (!name || !email || !password || !confirmPassword) {
      setErr('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setErr('Password must be at least 6 characters long');
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErr('Passwords do not match');
      setSubmitting(false);
      return;
    }

    const result = await register(name, email, password);
    setSubmitting(false);
    if (!result.success) {
      setErr(result.error || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-2xl relative border border-white/20">
        
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 mb-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-sans">Join UniScore</h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Register to start managing semesters and calculating GPA.</p>
        </div>

        {err && (
          <div className="flex items-center gap-2 p-3.5 mb-5 text-sm rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="e.g. you@college.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-slate-500">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center w-full py-3.5 mt-2 font-bold text-white transition-all bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:scale-102 disabled:opacity-50"
          >
            {submitting ? <Loader className="w-5 h-5 animate-spin" /> : 'Register Account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            Log In
          </button>
        </p>

      </div>
    </div>
  );
}
