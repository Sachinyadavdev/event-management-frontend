// Authentication hook for managing user state and permissions
import { useState, useEffect, createContext, useContext } from 'react';
import { storage } from '../utils/helpers';
import { authAPI } from '../services/apiEndpoints';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = storage.get('user');
    const savedToken = storage.get('token');
    
    if (savedUser && savedToken) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    storage.set('user', userData);
    storage.set('token', token);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    storage.remove('user');
    storage.remove('token');
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin') || hasRole('super_admin');
  };

  // Check if user is moderator
  const isModerator = () => {
    return hasRole('moderator') || isAdmin();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isModerator,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;