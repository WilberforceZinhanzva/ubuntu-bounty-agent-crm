'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function LeadsView({ user }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.client_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.client_contact_1?.includes(searchTerm) ||
                         lead.client_contact_2?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'claimed' && lead.is_claimed) ||
                         (statusFilter === 'unclaimed' && !lead.is_claimed);
    return matchesSearch && matchesStatus;
  });

  const handleClaimLead = async (leadId) => {
    const claimedBy = prompt('Enter your name to claim this lead:');
    if (!claimedBy) return;

    try {
      const response = await fetch(`/api/leads/${leadId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimedBy })
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error claiming lead:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
        <div className="flex space-x-3">
          <button className="btn-outline flex items-center space-x-2">
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Export</span>
          </button>
          {(user.user_type === 'super_admin' || user.user_type === 'view_edit') && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Lead</span>
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Leads</option>
              <option value="claimed">Claimed</option>
              <option value="unclaimed">Unclaimed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left">Client Name</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Interest Level</th>
                <th className="px-6 py-3 text-left">Agent</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{lead.client_full_name || 'N/A'}</td>
                  <td className="table-cell">{lead.client_contact_1 || 'N/A'}</td>
                  <td className="table-cell">{lead.client_location || 'N/A'}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      lead.client_interest_level === 'high' ? 'bg-red-100 text-red-800' :
                      lead.client_interest_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {lead.client_interest_level || 'N/A'}
                    </span>
                  </td>
                  <td className="table-cell">{lead.agent_name || 'N/A'}</td>
                  <td className="table-cell">
                    {lead.is_claimed ? (
                      <div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Claimed
                        </span>
                        <p className="text-xs text-gray-500 mt-1">by {lead.claimed_by}</p>
                      </div>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Unclaimed
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                      {!lead.is_claimed && (user.user_type === 'super_admin' || user.user_type === 'view_edit') && (
                        <button 
                          onClick={() => handleClaimLead(lead.id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Claim
                        </button>
                      )}
                      {user.user_type === 'super_admin' && (
                        <>
                          <button className="text-yellow-600 hover:text-yellow-800 text-sm">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No leads found matching your criteria.
          </div>
        )}
      </div>

      {showAddForm && (
        <AddLeadModal 
          onClose={() => setShowAddForm(false)} 
          onSuccess={() => {
            setShowAddForm(false);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
}

function AddLeadModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    agent_id: '',
    client_full_name: '',
    client_contact_1: '',
    client_contact_2: '',
    client_email: '',
    client_location: '',
    client_interest_level: 'medium'
  });
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add New Lead</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="input-field"
            value={formData.agent_id}
            onChange={(e) => setFormData({...formData, agent_id: e.target.value})}
            required
          >
            <option value="">Select Agent</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.full_name || agent.email || 'Unnamed Agent'}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Client Full Name"
            className="input-field"
            value={formData.client_full_name}
            onChange={(e) => setFormData({...formData, client_full_name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Client Contact 1"
            className="input-field"
            value={formData.client_contact_1}
            onChange={(e) => setFormData({...formData, client_contact_1: e.target.value})}
          />
          <input
            type="text"
            placeholder="Client Contact 2"
            className="input-field"
            value={formData.client_contact_2}
            onChange={(e) => setFormData({...formData, client_contact_2: e.target.value})}
          />
          <input
            type="email"
            placeholder="Client Email"
            className="input-field"
            value={formData.client_email}
            onChange={(e) => setFormData({...formData, client_email: e.target.value})}
          />
          <input
            type="text"
            placeholder="Client Location"
            className="input-field"
            value={formData.client_location}
            onChange={(e) => setFormData({...formData, client_location: e.target.value})}
          />
          <select
            className="input-field"
            value={formData.client_interest_level}
            onChange={(e) => setFormData({...formData, client_interest_level: e.target.value})}
          >
            <option value="low">Low Interest</option>
            <option value="medium">Medium Interest</option>
            <option value="high">High Interest</option>
            <option value="very_high">Very High Interest</option>
          </select>
          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Adding...' : 'Add Lead'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}