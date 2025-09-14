import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock,
  Target,
  User,
  Phone,
  Mail,
  MapPin,
  TrendingUp
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const LeadManagement = () => {
  const { agents, leads, addLead, updateLead, deleteLead, claimLead, unclaimLead } = useData();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [claimName, setClaimName] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');

  const [formData, setFormData] = useState({
    agentId: '',
    clientName: '',
    contact1: '',
    contact2: '',
    email: '',
    location: '',
    interestLevel: ''
  });

  const resetForm = () => {
    setFormData({
      agentId: '',
      clientName: '',
      contact1: '',
      contact2: '',
      email: '',
      location: '',
      interestLevel: ''
    });
    setSelectedLead(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedLead) {
      updateLead(selectedLead.id, formData);
    } else {
      addLead(formData);
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setFormData({
      agentId: lead.agentId || '',
      clientName: lead.clientName || '',
      contact1: lead.contact1 || '',
      contact2: lead.contact2 || '',
      email: lead.email || '',
      location: lead.location || '',
      interestLevel: lead.interestLevel || ''
    });
    setShowModal(true);
  };

  const handleDelete = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(leadId);
    }
  };

  const handleClaim = (lead) => {
    setSelectedLead(lead);
    setShowClaimModal(true);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (claimName.trim()) {
      claimLead(selectedLead.id, claimName.trim());
      setShowClaimModal(false);
      setClaimName('');
      setSelectedLead(null);
    }
  };

  const handleUnclaim = (leadId) => {
    if (window.confirm('Are you sure you want to unclaim this lead?')) {
      unclaimLead(leadId);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const agent = agents.find(a => a.id === lead.agentId);
    
    const matchesSearch = !searchTerm || 
      lead.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact1?.includes(searchTerm) ||
      lead.contact2?.includes(searchTerm) ||
      agent?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    
    const matchesDate = !dateFilter || 
      new Date(lead.createdAt).toDateString() === new Date(dateFilter).toDateString();
    
    const matchesAgent = !agentFilter || lead.agentId === agentFilter;
    
    return matchesSearch && matchesStatus && matchesDate && matchesAgent;
  });

  // Export functions
  const exportToPDF = (data, filename) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Ubuntu Bounty - Lead Report', 20, 20);
    
    const tableData = data.map(lead => {
      const agent = agents.find(a => a.id === lead.agentId);
      return [
        lead.clientName || 'N/A',
        lead.contact1 || 'N/A',
        lead.email || 'N/A',
        lead.location || 'N/A',
        agent?.fullName || 'N/A',
        lead.status,
        lead.claimedBy || 'N/A',
        new Date(lead.createdAt).toLocaleDateString()
      ];
    });

    doc.autoTable({
      head: [['Client Name', 'Contact', 'Email', 'Location', 'Agent', 'Status', 'Claimed By', 'Date']],
      body: tableData,
      startY: 30,
    });

    doc.save(filename);
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(lead => {
        const agent = agents.find(a => a.id === lead.agentId);
        return {
          'Client Name': lead.clientName || 'N/A',
          'Contact 1': lead.contact1 || 'N/A',
          'Contact 2': lead.contact2 || 'N/A',
          'Email': lead.email || 'N/A',
          'Location': lead.location || 'N/A',
          'Interest Level': lead.interestLevel || 'N/A',
          'Agent': agent?.fullName || 'N/A',
          'Status': lead.status,
          'Claimed By': lead.claimedBy || 'N/A',
          'Created Date': new Date(lead.createdAt).toLocaleDateString(),
          'Claimed Date': lead.claimedAt ? new Date(lead.claimedAt).toLocaleDateString() : 'N/A'
        };
      })
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    XLSX.writeFile(workbook, filename);
  };

  const exportToCSV = (data, filename) => {
    const csvData = data.map(lead => {
      const agent = agents.find(a => a.id === lead.agentId);
      return {
        'Client Name': lead.clientName || 'N/A',
        'Contact 1': lead.contact1 || 'N/A',
        'Contact 2': lead.contact2 || 'N/A',
        'Email': lead.email || 'N/A',
        'Location': lead.location || 'N/A',
        'Interest Level': lead.interestLevel || 'N/A',
        'Agent': agent?.fullName || 'N/A',
        'Status': lead.status,
        'Claimed By': lead.claimedBy || 'N/A',
        'Created Date': new Date(lead.createdAt).toLocaleDateString(),
        'Claimed Date': lead.claimedAt ? new Date(lead.claimedAt).toLocaleDateString() : 'N/A'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    XLSX.writeFile(workbook, filename);
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
            Lead Management
          </h1>
          <p style={{ color: '#666' }}>
            Manage client leads and track their status
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
          Add Lead
        </button>
      </div>

      {/* Filters and Export */}
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
                placeholder="Search by client name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="claimed">Claimed</option>
              <option value="unclaimed">Unclaimed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Agent</label>
            <select
              className="form-select"
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="">All Agents</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.fullName || 'Unnamed Agent'}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Date</label>
            <input
              type="date"
              className="form-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <button
            onClick={() => exportToPDF(filteredLeads, 'leads-report.pdf')}
            className="btn btn-secondary"
          >
            <Download size={16} />
            Export PDF
          </button>
          <button
            onClick={() => exportToExcel(filteredLeads, 'leads-report.xlsx')}
            className="btn btn-secondary"
          >
            <Download size={16} />
            Export Excel
          </button>
          <button
            onClick={() => exportToCSV(filteredLeads, 'leads-report.csv')}
            className="btn btn-secondary"
          >
            <Download size={16} />
            Export CSV
          </button>

          {leads.filter(lead => lead.status === 'claimed').length > 0 && (
            <button
              onClick={() => {
                const claimedLeads = leads.filter(lead => lead.status === 'claimed');
                exportToPDF(claimedLeads, 'claimed-leads-report.pdf');
              }}
              className="btn btn-primary"
            >
              <Download size={16} />
              Export Claimed Leads
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px' }}>
          Leads ({filteredLeads.length})
        </h2>

        {filteredLeads.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Interest</th>
                  <th>Agent</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => {
                  const agent = agents.find(a => a.id === lead.agentId);
                  return (
                    <tr key={lead.id}>
                      <td style={{ fontWeight: '500' }}>
                        {lead.clientName || 'Unnamed Client'}
                      </td>
                      <td>
                        <div>
                          {lead.contact1 && (
                            <div style={{ fontSize: '0.875rem' }}>{lead.contact1}</div>
                          )}
                          {lead.contact2 && (
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>{lead.contact2}</div>
                          )}
                        </div>
                      </td>
                      <td>{lead.email || '-'}</td>
                      <td>
                        {lead.location ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} />
                            {lead.location}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        {lead.interestLevel ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrendingUp size={14} />
                            {lead.interestLevel}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        {agent ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} />
                            {agent.fullName || 'Unnamed Agent'}
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        <div>
                          <span className={`badge ${lead.status === 'claimed' ? 'badge-success' : 'badge-warning'}`}>
                            {lead.status}
                          </span>
                          {lead.status === 'claimed' && lead.claimedBy && (
                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>
                              by {lead.claimedBy}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: '#666' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {lead.status === 'unclaimed' ? (
                            <button
                              onClick={() => handleClaim(lead)}
                              className="btn btn-primary"
                              style={{ padding: '6px 8px' }}
                              title="Claim Lead"
                            >
                              <CheckCircle size={14} />
                            </button>
                          ) : (
                            user?.permissions?.includes('admin') && (
                              <button
                                onClick={() => handleUnclaim(lead.id)}
                                className="btn btn-secondary"
                                style={{ padding: '6px 8px' }}
                                title="Unclaim Lead"
                              >
                                <Clock size={14} />
                              </button>
                            )
                          )}
                          
                          {user?.permissions?.includes('edit') && (
                            <button
                              onClick={() => handleEdit(lead)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 8px' }}
                              title="Edit Lead"
                            >
                              <Edit size={14} />
                            </button>
                          )}
                          
                          {user?.permissions?.includes('delete') && (
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="btn btn-danger"
                              style={{ padding: '6px 8px' }}
                              title="Delete Lead"
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
            <p>No leads found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedLead ? 'Edit Lead' : 'Add New Lead'}
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
                <label className="form-label">Select Agent</label>
                <select
                  className="form-select"
                  value={formData.agentId}
                  onChange={(e) => setFormData({...formData, agentId: e.target.value})}
                  required
                >
                  <option value="">Select an agent</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.fullName || 'Unnamed Agent'} 
                      {agent.location && ` - ${agent.location}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Client Full Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  placeholder="Enter client's full name"
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
                <label className="form-label">Client Email (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Location (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Enter client location"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Interest Level (Optional)</label>
                <select
                  className="form-select"
                  value={formData.interestLevel}
                  onChange={(e) => setFormData({...formData, interestLevel: e.target.value})}
                >
                  <option value="">Select interest level</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Very High">Very High</option>
                </select>
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
                  {selectedLead ? 'Update Lead' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Claim Lead</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowClaimModal(false);
                  setClaimName('');
                  setSelectedLead(null);
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleClaimSubmit}>
              <div className="form-group">
                <label className="form-label">Claimed By</label>
                <input
                  type="text"
                  className="form-input"
                  value={claimName}
                  onChange={(e) => setClaimName(e.target.value)}
                  placeholder="Enter name of person claiming this lead"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowClaimModal(false);
                    setClaimName('');
                    setSelectedLead(null);
                  }}
                  className="btn"
                  style={{ background: '#f0f0f0', color: '#666' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Claim Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;