'use client';

import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  CogIcon, 
  LogoutIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar({ user, activeView, setActiveView, onLogout }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, allowedRoles: ['super_admin', 'view_only', 'view_edit'] },
    { id: 'agents', name: 'Field Agents', icon: UsersIcon, allowedRoles: ['super_admin', 'view_only', 'view_edit'] },
    { id: 'leads', name: 'Leads', icon: DocumentTextIcon, allowedRoles: ['super_admin', 'view_only', 'view_edit'] },
    { id: 'users', name: 'System Users', icon: UserGroupIcon, allowedRoles: ['super_admin'] },
    { id: 'settings', name: 'Settings', icon: CogIcon, allowedRoles: ['super_admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.allowedRoles.includes(user.user_type)
  );

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">UB</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ubuntu Bounty</h2>
            <p className="text-sm text-gray-600">Agent CRM</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeView === item.id
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 px-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
          >
            <LogoutIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Logged in as:</p>
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  );
}