'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardStats from './DashboardStats';
import AgentsView from './AgentsView';
import LeadsView from './LeadsView';
import UsersView from './UsersView';
import SettingsView from './SettingsView';

export default function Dashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardStats stats={stats} />;
      case 'agents':
        return <AgentsView user={user} />;
      case 'leads':
        return <LeadsView user={user} />;
      case 'users':
        return user.user_type === 'super_admin' ? <UsersView /> : <div>Access Denied</div>;
      case 'settings':
        return user.user_type === 'super_admin' ? <SettingsView /> : <div>Access Denied</div>;
      default:
        return <DashboardStats stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        user={user} 
        activeView={activeView} 
        setActiveView={setActiveView}
        onLogout={onLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeView === 'dashboard' ? 'Dashboard' : activeView}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {user.user_type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}