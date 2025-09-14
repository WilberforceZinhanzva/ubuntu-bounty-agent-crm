import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  UserCheck,
  Shield,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPin, setShowPin] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone1: '',
    phone2: '',
    role: 'user',
    permissions: ['view'],
    pin: '2025'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      email: '',
      phone1: '',
      phone2: '',
      role: 'user',
      permissions: ['view'],
      pin: '2025'
    });
    setSelectedUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedUser) {
      updateUser(selectedUser.id, formData);
    } else {
      addUser(formData);
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      phone1: user.phone1 || '',
      phone2: user.phone2 || '',
      role: user.role || 'user',
      permissions: user.permissions || ['view'],
      pin: user.pin || '2025'
    });
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own account.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const handlePermissionChange = (permission) => {
    const newPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({...formData, permissions: newPermissions});
  };

  const togglePinVisibility = (userId) => {
    setShowPin(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone1?.includes(searchTerm) ||
      user.phone2?.includes(searchTerm);
    
    return matchesSearch;
  });

  const getPermissionBadge = (permissions) => {
    if (permissions.includes('admin')) return { text: 'Admin', class: 'badge-success' };
    if (permissions.includes('delete')) return { text: 'Full Access', class: 'badge-success' };
    if (permissions.includes('edit')) return { text: 'Edit Access', class: 'badge-warning' };
    return { text: 'View Only', class: 'badge-warning' };
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
            User Management
          </h1>
          <p style={{ color: '#666' }}>
            Manage system users and their permissions
          </p>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#666'
            }} 
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px' }}>
          System Users ({filteredUsers.length})
        </h2>

        {filteredUsers.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>PIN</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const permissionBadge = getPermissionBadge(user.permissions || []);
                  return (
                    <tr key={user.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '500' }}>
                            {user.name} {user.surname}
                          </div>
                          {user.email && (
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>
                              {user.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          {user.phone1 && (
                            <div style={{ fontSize: '0.875rem' }}>{user.phone1}</div>
                          )}
                          {user.phone2 && (
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>{user.phone2}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {user.role === 'super_admin' ? <Shield size={14} /> : <UserCheck size={14} />}
                          {user.role === 'super_admin' ? 'Super Admin' : 'User'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${permissionBadge.class}`}>
                          {permissionBadge.text}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace' }}>
                            {showPin[user.id] ? user.pin : '••••'}
                          </span>
                          <button
                            onClick={() => togglePinVisibility(user.id)}
                            className="btn"
                            style={{ 
                              padding: '4px',
                              background: 'none',
                              border: 'none',
                              color: '#666'
                            }}
                          >
                            {showPin[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: '#666' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(user)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 8px' }}
                            title="Edit User"
                          >
                            <Edit size={14} />
                          </button>
                          
                          {user.id !== currentUser.id && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="btn btn-danger"
                              style={{ padding: '6px 8px' }}
                              title="Delete User"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <UserCheck size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Surname (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.surname}
                    onChange={(e) => setFormData({...formData, surname: e.target.value})}
                    placeholder="Enter surname"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Phone 1 (Optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phone1}
                    onChange={(e) => setFormData({...formData, phone1: e.target.value})}
                    placeholder="Primary phone number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone 2 (Optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phone2}
                    onChange={(e) => setFormData({...formData, phone2: e.target.value})}
                    placeholder="Alternative phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Permissions</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {[
                    { key: 'view', label: 'View Rights - Can view data' },
                    { key: 'edit', label: 'Edit Rights - Can modify data' },
                    { key: 'delete', label: 'Delete Rights - Can delete data' },
                    { key: 'admin', label: 'Admin Rights - Full system access' }
                  ].map(permission => (
                    <label key={permission.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.key)}
                        onChange={() => handlePermissionChange(permission.key)}
                      />
                      <span>{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Login PIN</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.pin}
                  onChange={(e) => setFormData({...formData, pin: e.target.value})}
                  placeholder="Enter login PIN"
                  required
                  style={{ fontFamily: 'monospace' }}
                />
                <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                  Default PIN is 2025. You can customize it for each user.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn"
                  style={{ background: '#f0f0f0', color: '#666' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;