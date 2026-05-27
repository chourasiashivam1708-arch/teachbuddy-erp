import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check for saved login on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('teachbuddy_user');
    const savedToken = localStorage.getItem('teachbuddy_token');

    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 2. Save badge on successful login
  const login = (userData, token) => {
    setCurrentUser(userData);
    localStorage.setItem('teachbuddy_user', JSON.stringify(userData));
    localStorage.setItem('teachbuddy_token', token);
  };

  // 3. Destroy badge on logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('teachbuddy_user');
    localStorage.removeItem('teachbuddy_token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);