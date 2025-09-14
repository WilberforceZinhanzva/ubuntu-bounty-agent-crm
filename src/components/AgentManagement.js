import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Target
} from 'lucide-react';

const AgentManagement = () => {
  const { agents, leads, addAgent, updateAgent, deleteAgent } = useData();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [viewAgent, setViewAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    contact1: '',
    contact2: '',
    email: '',
    location: ''
  });

  const resetForm = () => {
    setFormData({
      fullName: '',
      contact1: '',
      contact2: '',
      email: '',
      location: ''
    });
    setSelectedAgent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedAgent) {
      updateAgent(selectedAgent.id, formData);
    } else {
      addAgent(formData);
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (agent) => {
    setSelectedAgent(agent);
    setFormData({
      fullName: agent.fullName || '',
      contact1: agent.contact1 || '',
      contact2: agent.contact2 || '',
      email: agent.email || '',
      location: agent.location || ''
    });
    setShowModal(true);
  };

  const handleDelete = (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent? This will also delete all associated leads.')) {
      deleteAgent(agentId);
    }
  };

  const handleView = (agent) => {
    setViewAgent(agent);
  };

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = !searchTerm || 
      agent.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.contact1?.includes(searchTerm) ||
      agent.contact2?.includes(searchTerm) ||
      agent.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      agent.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesDate = !dateFilter || 
      new Date(agent.createdAt).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesSearch && matchesLocation && matchesDate;
  });

  // Get unique locations for filter
  const locations = [...new Set(agents.map(agent => agent.location).filter(Boolean))];

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
            Agent Management
          </h1>
          <p style={{ color: '#666' }}>
            Manage field agents and their information
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
          Add Agent
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="filters">
          <div className="filter-group">
            <label>Search</label>
            <div style={{ position: 'relative' }}>
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
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select
              className="form-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Registration Date</label>
            <input
              type="date"
              className="form-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {(searchTerm || locationFilter || dateFilter) && (
            <div className="filter-group">
              <label>&nbsp;</label>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setDateFilter('');
                }}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Agents Table */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px' }}>
          Registered Agents ({filteredAgents.length})
        </h2>

        {filteredAgents.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Leads</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map(agent => {
                  const agentLeads = leads.filter(lead => lead.agentId === agent.id);
                  return (
                    <tr key={agent.id}>
                      <td style={{ fontWeight: '500' }}>
                        {agent.fullName || 'Unnamed Agent'}
                      </td>
                      <td>
                        <div>
                          {agent.contact1 && (
                            <div style={{ fontSize: '0.875rem' }}>{agent.contact1}</div>
                          )}
                          {agent.contact2 && (
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>{agent.contact2}</div>
                          )}
                        </div>
                      </td>
                      <td>{agent.email || '-'}</td>
                      <td>
                        {agent.location ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} />
                            {agent.location}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {agentLeads.length}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: '#666' }}>
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleView(agent)}
                            className="btn"
                            style={{ 
                              padding: '6px 8px',
                              background: '#f0f0f0',
                              color: '#666'
                            }}
                            title="View Profile"
                          >
                            <Eye size={14} />
                          </button>
                          
                          {user?.permissions?.includes('edit') && (
                            <button
                              onClick={() => handleEdit(agent)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 8px' }}
                              title="Edit Agent"
                            >
                              <Edit size={14} />
                            </button>
                          )}
                          
                          {user?.permissions?.includes('delete') && (
                            <button
                              onClick={() => handleDelete(agent.id)}
                              className="btn btn-danger"
                              style={{ padding: '6px 8px' }}
                              title="Delete Agent"
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
            <Target size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No agents found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedAgent ? 'Edit Agent' : 'Add New Agent'}
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
              <div className="form-group">
                <label className="form-label">Full Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Enter agent's full name"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Contact 1 (Optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.contact1}
                    onChange={(e) => setFormData({...formData, contact1: e.target.value})}
                    placeholder="Primary contact number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact 2 (Optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.contact2}
                    onChange={(e) => setFormData({...formData, contact2: e.target.value})}
                    placeholder="Secondary contact number"
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

              <div className="form-group">
                <label className="form-label">Location (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Enter agent location"
                />
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
                  {selectedAgent ? 'Update Agent' : 'Add Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Agent Modal */}
      {viewAgent && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Agent Profile</h3>
              <button 
                className="close-btn"
                onClick={() => setViewAgent(null)}
              >
                ×
              </button>
            </div>

            <div>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>
                  {viewAgent.fullName || 'Unnamed Agent'}
                </h4>
                
                <div className="grid grid-2" style={{ gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Phone size={16} color="#666" />
                      <span style={{ fontWeight: '500' }}>Contact Information</span>
                    </div>
                    <div style={{ paddingLeft: '24px' }}>
                      {viewAgent.contact1 && <div>{viewAgent.contact1}</div>}
                      {viewAgent.contact2 && <div>{viewAgent.contact2}</div>}
                      {!viewAgent.contact1 && !viewAgent.contact2 && (
                        <div style={{ color: '#666' }}>No contact information</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Mail size={16} color="#666" />
                      <span style={{ fontWeight: '500' }}>Email</span>
                    </div>
                    <div style={{ paddingLeft: '24px' }}>
                      {viewAgent.email || <span style={{ color: '#666' }}>No email provided</span>}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <MapPin size={16} color="#666" />
                      <span style={{ fontWeight: '500' }}>Location</span>
                    </div>
                    <div style={{ paddingLeft: '24px' }}>
                      {viewAgent.location || <span style={{ color: '#666' }}>No location provided</span>}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Calendar size={16} color="#666" />
                      <span style={{ fontWeight: '500' }}>Registered</span>
                    </div>
                    <div style={{ paddingLeft: '24px' }}>
                      {new Date(viewAgent.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Target size={16} />
                  Lead History ({leads.filter(lead => lead.agentId === viewAgent.id).length})
                </h4>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {leads.filter(lead => lead.agentId === viewAgent.id).length > 0 ? (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads
                          .filter(lead => lead.agentId === viewAgent.id)
                          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                          .map(lead => (
                            <tr key={lead.id}>
                              <td>{lead.clientName || 'Unnamed Client'}</td>
                              <td>
                                <span className={`badge ${lead.status === 'claimed' ? 'badge-success' : 'badge-warning'}`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      No leads submitted yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;