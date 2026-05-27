import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. CHECK FOR SAVED LOGIN: When the app opens, check if they already have a badge saved
  useEffect(() => {
    const savedUser = localStorage.getItem('teachbuddy_user');
    const savedToken = localStorage.getItem('teachbuddy_token');

    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 2. THE LOGIN FUNCTION: Called when they successfully type their password
  const login = (userData, token) => {
    setCurrentUser(userData);
    localStorage.setItem('teachbuddy_user', JSON.stringify(userData));
    localStorage.setItem('teachbuddy_token', token);
  };

  // 3. THE LOGOUT FUNCTION: Destroys the badge and kicks them out
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('teachbuddy_user');
    localStorage.removeItem('teachbuddy_token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);