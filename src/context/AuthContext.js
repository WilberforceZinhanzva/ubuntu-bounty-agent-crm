import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ubuntu_bounty_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ubuntu_bounty_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (pin) => {
    try {
      if (pin !== '2025') {
        throw new Error('Invalid PIN');
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('ubuntu_bounty_users') || '[]');
      
      // If no users exist, create default super admin
      if (users.length === 0) {
        const defaultAdmin = {
          id: 'admin_1',
          name: 'Super Admin',
          surname: '',
          email: '',
          phone1: '',
          phone2: '',
          role: 'super_admin',
          permissions: ['view', 'edit', 'delete', 'admin'],
          pin: '2025',
          createdAt: new Date().toISOString()
        };
        users.push(defaultAdmin);
        localStorage.setItem('ubuntu_bounty_users', JSON.stringify(users));
      }

      // For simplicity, login as the first super admin user
      const adminUser = users.find(u => u.role === 'super_admin') || users[0];
      
      setUser(adminUser);
      localStorage.setItem('ubuntu_bounty_user', JSON.stringify(adminUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ubuntu_bounty_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ubuntu_bounty_user', JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('ubuntu_bounty_users') || '[]');
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('ubuntu_bounty_users', JSON.stringify(users));
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};