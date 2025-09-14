import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { agents, leads, getStats } = useData();
  const stats = getStats();

  // Group agents by location
  const agentsByLocation = agents.reduce((acc, agent) => {
    const location = agent.location || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#666' }}>
          Overview of your lead management system
        </p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-number">{stats.totalAgents}</div>
          <div className="stat-label">
            <Users size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Total Agents
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-number">{stats.weeklyLeads}</div>
          <div className="stat-label">
            <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Weekly Leads
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.monthlyLeads}</div>
          <div className="stat-label">
            <TrendingUp size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Monthly Leads
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-number">{stats.totalLeads}</div>
          <div className="stat-label">
            <Target size={16} style={{ display: 'inline', marginRight: '4px' }} />
            All Time Leads
          </div>
        </div>
      </div>

      {/* Lead Status Statistics */}
      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-number">{stats.claimedLeads}</div>
          <div className="stat-label">
            <CheckCircle size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Claimed Leads
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-number">{stats.unclaimedLeads}</div>
          <div className="stat-label">
            <Clock size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Unclaimed Leads
          </div>
        </div>
      </div>

      {/* Agents by Location */}
      <div className="card">
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <BarChart3 size={20} />
          Agents by Location
        </h2>

        {Object.keys(agentsByLocation).length > 0 ? (
          <div className="grid grid-3">
            {Object.entries(agentsByLocation).map(([location, count]) => (
              <div 
                key={location}
                style={{
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#4CAF50',
                  marginBottom: '4px'
                }}>
                  {count}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  <MapPin size={14} />
                  {location}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666' 
          }}>
            <MapPin size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No agents registered yet</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Clock size={20} />
          Recent Activity
        </h2>

        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {leads.length > 0 ? (
            <div>
              {leads
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10)
                .map((lead) => {
                  const agent = agents.find(a => a.id === lead.agentId);
                  return (
                    <div 
                      key={lead.id}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #e0e0e0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '500' }}>
                          New lead: {lead.clientName || 'Unnamed Client'}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          Agent: {agent?.fullName || 'Unknown Agent'}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666' 
            }}>
              <Target size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;