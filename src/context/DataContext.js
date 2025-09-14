import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    companyLogo: null
  });

  useEffect(() => {
    // Load data from localStorage
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedAgents = localStorage.getItem('ubuntu_bounty_agents');
      const savedLeads = localStorage.getItem('ubuntu_bounty_leads');
      const savedUsers = localStorage.getItem('ubuntu_bounty_users');
      const savedSettings = localStorage.getItem('ubuntu_bounty_settings');

      if (savedAgents) setAgents(JSON.parse(savedAgents));
      if (savedLeads) setLeads(JSON.parse(savedLeads));
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveAgents = (newAgents) => {
    setAgents(newAgents);
    localStorage.setItem('ubuntu_bounty_agents', JSON.stringify(newAgents));
  };

  const saveLeads = (newLeads) => {
    setLeads(newLeads);
    localStorage.setItem('ubuntu_bounty_leads', JSON.stringify(newLeads));
  };

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('ubuntu_bounty_users', JSON.stringify(newUsers));
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('ubuntu_bounty_settings', JSON.stringify(newSettings));
  };

  // Agent operations
  const addAgent = (agent) => {
    const newAgent = {
      ...agent,
      id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    const newAgents = [...agents, newAgent];
    saveAgents(newAgents);
    return newAgent;
  };

  const updateAgent = (agentId, updates) => {
    const newAgents = agents.map(agent =>
      agent.id === agentId ? { ...agent, ...updates, updatedAt: new Date().toISOString() } : agent
    );
    saveAgents(newAgents);
  };

  const deleteAgent = (agentId) => {
    const newAgents = agents.filter(agent => agent.id !== agentId);
    saveAgents(newAgents);
    
    // Also delete leads associated with this agent
    const newLeads = leads.filter(lead => lead.agentId !== agentId);
    saveLeads(newLeads);
  };

  // Lead operations
  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'unclaimed',
      createdAt: new Date().toISOString()
    };
    const newLeads = [...leads, newLead];
    saveLeads(newLeads);
    return newLead;
  };

  const updateLead = (leadId, updates) => {
    const newLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead
    );
    saveLeads(newLeads);
  };

  const deleteLead = (leadId) => {
    const newLeads = leads.filter(lead => lead.id !== leadId);
    saveLeads(newLeads);
  };

  const claimLead = (leadId, claimedBy) => {
    updateLead(leadId, {
      status: 'claimed',
      claimedBy,
      claimedAt: new Date().toISOString()
    });
  };

  const unclaimLead = (leadId) => {
    updateLead(leadId, {
      status: 'unclaimed',
      claimedBy: null,
      claimedAt: null
    });
  };

  // User operations
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    const newUsers = [...users, newUser];
    saveUsers(newUsers);
    return newUser;
  };

  const updateUser = (userId, updates) => {
    const newUsers = users.map(user =>
      user.id === userId ? { ...user, ...updates, updatedAt: new Date().toISOString() } : user
    );
    saveUsers(newUsers);
  };

  const deleteUser = (userId) => {
    const newUsers = users.filter(user => user.id !== userId);
    saveUsers(newUsers);
  };

  // Statistics
  const getStats = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const weeklyLeads = leads.filter(lead => 
      new Date(lead.createdAt) >= startOfWeek
    ).length;

    const monthlyLeads = leads.filter(lead => 
      new Date(lead.createdAt) >= startOfMonth
    ).length;

    const claimedLeads = leads.filter(lead => lead.status === 'claimed').length;
    const unclaimedLeads = leads.filter(lead => lead.status === 'unclaimed').length;

    return {
      totalAgents: agents.length,
      weeklyLeads,
      monthlyLeads,
      totalLeads: leads.length,
      claimedLeads,
      unclaimedLeads
    };
  };

  const value = {
    agents,
    leads,
    users,
    settings,
    addAgent,
    updateAgent,
    deleteAgent,
    addLead,
    updateLead,
    deleteLead,
    claimLead,
    unclaimLead,
    addUser,
    updateUser,
    deleteUser,
    saveSettings,
    getStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};