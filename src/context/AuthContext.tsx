import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { DEMO_USERS } from '../data/demoData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isDemoMode: boolean;
  login: (email: string, role?: UserRole) => boolean;
  loginAsDemo: (role: UserRole) => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'isDemo' | 'verified'>) => User;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [isDemoMode] = useState<boolean>(true);

  useEffect(() => {
    storageService.setCurrentUser(user);
  }, [user]);

  const loginAsDemo = (targetRole: UserRole) => {
    const demoUser = DEMO_USERS.find(u => u.role === targetRole) || DEMO_USERS[0];
    setUser(demoUser);
    storageService.setCurrentUser(demoUser);
  };

  const login = (email: string, preferredRole?: UserRole): boolean => {
    const users = storageService.getUsers();
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // If user not found, try matching by role in demo accounts
    if (!found && preferredRole) {
      found = users.find(u => u.role === preferredRole);
    }

    if (found) {
      setUser(found);
      storageService.setCurrentUser(found);
      return true;
    }

    // Default fallback demo donor
    const fallback = users[0];
    setUser(fallback);
    storageService.setCurrentUser(fallback);
    return true;
  };

  const register = (userData: Omit<User, 'id' | 'createdAt' | 'isDemo' | 'verified'>): User => {
    const newUser: User = {
      ...userData,
      id: 'user_' + Date.now(),
      isDemo: true, // Local demo persistence
      verified: false,
      createdAt: new Date().toISOString(),
    };

    const users = storageService.getUsers();
    storageService.saveUsers([...users, newUser]);
    setUser(newUser);
    storageService.setCurrentUser(newUser);

    storageService.addAdminLog({
      adminId: 'system',
      adminName: 'Registration Engine',
      action: 'New Registration',
      targetType: 'user',
      targetId: newUser.id,
      details: `New ${newUser.role} registered: "${newUser.name}" (${newUser.city}, ${newUser.area}).`,
    });

    return newUser;
  };

  const logout = () => {
    setUser(null);
    storageService.setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    storageService.setCurrentUser(updatedUser);

    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storageService.saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isDemoMode,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

