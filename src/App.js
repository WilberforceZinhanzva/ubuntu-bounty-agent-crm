import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AgentManagement from './components/AgentManagement';
import LeadManagement from './components/LeadManagement';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<AgentManagement />} />
          <Route path="/leads" element={<LeadManagement />} />
          <Route path="/users" element={
            user.role === 'super_admin' ? <UserManagement /> : <Navigate to="/" />
          } />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;