import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Apply theme on load
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch current user and dashboard data if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        localStorage.setItem('token', token);
        try {
          const userRes = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!userRes.ok) {
            throw new Error('Session expired');
          }
          const userData = await userRes.json();
          setUser(userData);

          const dashRes = await fetch(`${API_URL}/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (dashRes.ok) {
            const dashData = await dashRes.json();
            setDashboardData(dashData);
          }
        } catch (err) {
          console.error(err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const parseResponse = async (res) => {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    const text = await res.text();
    return { msg: text || `HTTP error ${res.status}` };
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await parseResponse(res);
      if (!res.ok) {
        throw new Error(data.msg || 'Login failed');
      }
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await parseResponse(res);
      if (!res.ok) {
        throw new Error(data.msg || 'Registration failed');
      }
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setDashboardData(null);
  };

  const apiCall = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    const res = await fetch(`${API_URL}${url}`, { ...options, headers });
    const data = await parseResponse(res);
    if (!res.ok) {
      throw new Error(data.msg || 'Something went wrong');
    }
    setDashboardData(data);
    return data;
  };

  const addSemester = async (name) => {
    return apiCall('/dashboard/semesters', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  };

  const editSemester = async (semesterId, name) => {
    return apiCall(`/dashboard/semesters/${semesterId}`, {
      method: 'PUT',
      body: JSON.stringify({ name })
    });
  };

  const deleteSemester = async (semesterId) => {
    return apiCall(`/dashboard/semesters/${semesterId}`, {
      method: 'DELETE'
    });
  };

  const addSubject = async (semesterId, subject) => {
    return apiCall(`/dashboard/semesters/${semesterId}/subjects`, {
      method: 'POST',
      body: JSON.stringify(subject)
    });
  };

  const editSubject = async (semesterId, subjectId, subject) => {
    return apiCall(`/dashboard/semesters/${semesterId}/subjects/${subjectId}`, {
      method: 'PUT',
      body: JSON.stringify(subject)
    });
  };

  const deleteSubject = async (semesterId, subjectId) => {
    return apiCall(`/dashboard/semesters/${semesterId}/subjects/${subjectId}`, {
      method: 'DELETE'
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      dashboardData,
      loading,
      error,
      theme,
      toggleTheme,
      login,
      register,
      logout,
      addSemester,
      editSemester,
      deleteSemester,
      addSubject,
      editSubject,
      deleteSubject
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
