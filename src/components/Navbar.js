import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Home, 
  Users, 
  Target, 
  UserCheck, 
  Settings, 
  LogOut,
  Building2
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useData();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/agents', label: 'Agents', icon: Users },
    { path: '/leads', label: 'Leads', icon: Target },
    ...(user?.role === 'super_admin' ? [
      { path: '/users', label: 'Users', icon: UserCheck }
    ] : []),
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {settings.companyLogo ? (
            <img 
              src={settings.companyLogo} 
              alt="Company Logo" 
              style={{ width: '40px', height: '40px', borderRadius: '8px' }}
            />
          ) : (
            <Building2 size={32} />
          )}
          <div className="navbar-brand">Ubuntu Bounty</div>
        </div>

        <ul className="navbar-nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link 
                to={path} 
                className={isActive(path) ? 'active' : ''}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Icon size={16} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.875rem' }}>
            Welcome, {user?.name || 'User'}
          </span>
          <button 
            onClick={logout}
            className="btn"
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              color: 'white',
              padding: '8px 12px'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;