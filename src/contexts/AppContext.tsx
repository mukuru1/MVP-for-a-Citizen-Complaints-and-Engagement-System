import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Complaint, Notification, AppState } from '../types';
import { initializeLocalStorage, getAppState, authenticateUser, logoutUser } from '../utils/storage';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  complaints: Complaint[];
  notifications: Notification[];
  login: (email: string, role: string) => User | null;
  logout: () => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>({
    users: [],
    complaints: [],
    notifications: [],
    isAuthenticated: false,
    currentUser: null,
  });

  // Initialize data on mount
  useEffect(() => {
    initializeLocalStorage();
    refreshData();
  }, []);

  // Refresh data from local storage
  const refreshData = () => {
    const state = getAppState();
    setAppState(state);
  };

  // Handle user login
  const login = (email: string, role: string) => {
    const user = authenticateUser(email, role);
    if (user) {
      refreshData();
    }
    return user;
  };

  // Handle user logout
  const logout = () => {
    logoutUser();
    refreshData();
  };

  const value = {
    currentUser: appState.currentUser || null,
    isAuthenticated: appState.isAuthenticated,
    complaints: appState.complaints,
    notifications: appState.notifications,
    login,
    logout,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};