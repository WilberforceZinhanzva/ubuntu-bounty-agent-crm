'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AgentsView({ user }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

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
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || agent.agent_location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Field Agents</h2>
        {(user.user_type === 'super_admin' || user.user_type === 'view_edit') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Agent</span>
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <input
              type="text"
              placeholder="Filter by location"
              className="input-field"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Registered</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{agent.full_name || 'N/A'}</td>
                  <td className="table-cell">{agent.contact_detail_1 || 'N/A'}</td>
                  <td className="table-cell">{agent.email || 'N/A'}</td>
                  <td className="table-cell">{agent.agent_location || 'N/A'}</td>
                  <td className="table-cell">
                    {new Date(agent.created_at).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                      {(user.user_type === 'super_admin' || user.user_type === 'view_edit') && (
                        <>
                          <button className="text-green-600 hover:text-green-800 text-sm">
                            Edit
                          </button>
                          {user.user_type === 'super_admin' && (
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No agents found matching your criteria.
          </div>
        )}
      </div>

      {showAddForm && (
        <AddAgentModal 
          onClose={() => setShowAddForm(false)} 
          onSuccess={() => {
            setShowAddForm(false);
            fetchAgents();
          }}
        />
      )}
    </div>
  );
}

function AddAgentModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    contact_detail_1: '',
    contact_detail_2: '',
    email: '',
    agent_location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding agent:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Agent</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Contact Detail 1"
            className="input-field"
            value={formData.contact_detail_1}
            onChange={(e) => setFormData({...formData, contact_detail_1: e.target.value})}
          />
          <input
            type="text"
            placeholder="Contact Detail 2"
            className="input-field"
            value={formData.contact_detail_2}
            onChange={(e) => setFormData({...formData, contact_detail_2: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="text"
            placeholder="Location"
            className="input-field"
            value={formData.agent_location}
            onChange={(e) => setFormData({...formData, agent_location: e.target.value})}
          />
          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Adding...' : 'Add Agent'}
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