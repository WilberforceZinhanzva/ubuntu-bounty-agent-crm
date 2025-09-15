import { query } from './db.js';

// System Users Queries
export const systemUsersQueries = {
  // Create a new system user
  create: async (userData) => {
    const { name, surname, email, phone_number_1, phone_number_2, user_type, login_pin } = userData;
    const sql = `
      INSERT INTO system_users (name, surname, email, phone_number_1, phone_number_2, user_type, login_pin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await query(sql, [name, surname, email, phone_number_1, phone_number_2, user_type, login_pin || '2025']);
    return result.rows[0];
  },

  // Get all system users
  getAll: async () => {
    const sql = 'SELECT * FROM system_users WHERE is_active = true ORDER BY created_at DESC';
    const result = await query(sql);
    return result.rows;
  },

  // Get user by email and pin for authentication
  authenticate: async (email, pin) => {
    const sql = 'SELECT * FROM system_users WHERE email = $1 AND login_pin = $2 AND is_active = true';
    const result = await query(sql, [email, pin]);
    return result.rows[0];
  },

  // Update user
  update: async (id, userData) => {
    const { name, surname, email, phone_number_1, phone_number_2, user_type, login_pin } = userData;
    const sql = `
      UPDATE system_users 
      SET name = $1, surname = $2, email = $3, phone_number_1 = $4, 
          phone_number_2 = $5, user_type = $6, login_pin = $7
      WHERE id = $8
      RETURNING *
    `;
    const result = await query(sql, [name, surname, email, phone_number_1, phone_number_2, user_type, login_pin, id]);
    return result.rows[0];
  },

  // Delete user (soft delete)
  delete: async (id) => {
    const sql = 'UPDATE system_users SET is_active = false WHERE id = $1';
    await query(sql, [id]);
  }
};

// Field Agents Queries
export const fieldAgentsQueries = {
  // Create a new field agent
  create: async (agentData) => {
    const { full_name, contact_detail_1, contact_detail_2, email, agent_location } = agentData;
    const sql = `
      INSERT INTO field_agents (full_name, contact_detail_1, contact_detail_2, email, agent_location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(sql, [full_name, contact_detail_1, contact_detail_2, email, agent_location]);
    return result.rows[0];
  },

  // Get all field agents
  getAll: async () => {
    const sql = 'SELECT * FROM field_agents WHERE is_active = true ORDER BY created_at DESC';
    const result = await query(sql);
    return result.rows;
  },

  // Get agents by location
  getByLocation: async (location) => {
    const sql = 'SELECT * FROM field_agents WHERE agent_location ILIKE $1 AND is_active = true';
    const result = await query(sql, [`%${location}%`]);
    return result.rows;
  },

  // Get agents by registration date range
  getByDateRange: async (startDate, endDate) => {
    const sql = 'SELECT * FROM field_agents WHERE created_at BETWEEN $1 AND $2 AND is_active = true';
    const result = await query(sql, [startDate, endDate]);
    return result.rows;
  },

  // Get agent with leads count
  getWithLeadsCount: async (agentId) => {
    const sql = `
      SELECT fa.*, 
             COUNT(l.id) as total_leads,
             COUNT(CASE WHEN l.is_claimed = true THEN 1 END) as claimed_leads,
             COUNT(CASE WHEN l.is_claimed = false THEN 1 END) as unclaimed_leads
      FROM field_agents fa
      LEFT JOIN leads l ON fa.id = l.agent_id
      WHERE fa.id = $1 AND fa.is_active = true
      GROUP BY fa.id
    `;
    const result = await query(sql, [agentId]);
    return result.rows[0];
  },

  // Get agents grouped by location
  getGroupedByLocation: async () => {
    const sql = `
      SELECT agent_location, COUNT(*) as agent_count
      FROM field_agents 
      WHERE is_active = true AND agent_location IS NOT NULL
      GROUP BY agent_location
      ORDER BY agent_count DESC
    `;
    const result = await query(sql);
    return result.rows;
  },

  // Delete agent
  delete: async (id) => {
    const sql = 'UPDATE field_agents SET is_active = false WHERE id = $1';
    await query(sql, [id]);
  }
};

// Leads Queries
export const leadsQueries = {
  // Create a new lead
  create: async (leadData) => {
    const { agent_id, client_full_name, client_contact_1, client_contact_2, client_email, client_location, client_interest_level } = leadData;
    const sql = `
      INSERT INTO leads (agent_id, client_full_name, client_contact_1, client_contact_2, client_email, client_location, client_interest_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await query(sql, [agent_id, client_full_name, client_contact_1, client_contact_2, client_email, client_location, client_interest_level]);
    return result.rows[0];
  },

  // Get all leads with agent information
  getAllWithAgents: async () => {
    const sql = `
      SELECT l.*, fa.full_name as agent_name, fa.agent_location as agent_location
      FROM leads l
      LEFT JOIN field_agents fa ON l.agent_id = fa.id
      ORDER BY l.created_at DESC
    `;
    const result = await query(sql);
    return result.rows;
  },

  // Get leads by agent
  getByAgent: async (agentId) => {
    const sql = 'SELECT * FROM leads WHERE agent_id = $1 ORDER BY created_at DESC';
    const result = await query(sql, [agentId]);
    return result.rows;
  },

  // Search leads by client name or contact
  search: async (searchTerm) => {
    const sql = `
      SELECT l.*, fa.full_name as agent_name
      FROM leads l
      LEFT JOIN field_agents fa ON l.agent_id = fa.id
      WHERE l.client_full_name ILIKE $1 
         OR l.client_contact_1 ILIKE $1 
         OR l.client_contact_2 ILIKE $1
      ORDER BY l.created_at DESC
    `;
    const result = await query(sql, [`%${searchTerm}%`]);
    return result.rows;
  },

  // Get leads by date range
  getByDateRange: async (startDate, endDate) => {
    const sql = `
      SELECT l.*, fa.full_name as agent_name
      FROM leads l
      LEFT JOIN field_agents fa ON l.agent_id = fa.id
      WHERE l.created_at BETWEEN $1 AND $2
      ORDER BY l.created_at DESC
    `;
    const result = await query(sql, [startDate, endDate]);
    return result.rows;
  },

  // Claim a lead
  claim: async (leadId, claimedBy) => {
    const sql = `
      UPDATE leads 
      SET is_claimed = true, claimed_by = $1, claimed_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await query(sql, [claimedBy, leadId]);
    return result.rows[0];
  },

  // Reverse claim (for super admin)
  reverseClaim: async (leadId) => {
    const sql = `
      UPDATE leads 
      SET is_claimed = false, claimed_by = NULL, claimed_at = NULL
      WHERE id = $1
      RETURNING *
    `;
    const result = await query(sql, [leadId]);
    return result.rows[0];
  },

  // Get claimed leads
  getClaimed: async () => {
    const sql = `
      SELECT l.*, fa.full_name as agent_name
      FROM leads l
      LEFT JOIN field_agents fa ON l.agent_id = fa.id
      WHERE l.is_claimed = true
      ORDER BY l.claimed_at DESC
    `;
    const result = await query(sql);
    return result.rows;
  },

  // Delete lead
  delete: async (id) => {
    const sql = 'DELETE FROM leads WHERE id = $1';
    await query(sql, [id]);
  }
};

// Dashboard Statistics Queries
export const dashboardQueries = {
  // Get dashboard statistics
  getStats: async () => {
    const totalAgentsQuery = 'SELECT COUNT(*) as count FROM field_agents WHERE is_active = true';
    const totalLeadsQuery = 'SELECT COUNT(*) as count FROM leads';
    const claimedLeadsQuery = 'SELECT COUNT(*) as count FROM leads WHERE is_claimed = true';
    const unclaimedLeadsQuery = 'SELECT COUNT(*) as count FROM leads WHERE is_claimed = false';
    
    // Weekly leads (last 7 days)
    const weeklyLeadsQuery = `
      SELECT COUNT(*) as count 
      FROM leads 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
    `;
    
    // Monthly leads (current month)
    const monthlyLeadsQuery = `
      SELECT COUNT(*) as count 
      FROM leads 
      WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;

    const [totalAgents, totalLeads, claimedLeads, unclaimedLeads, weeklyLeads, monthlyLeads] = await Promise.all([
      query(totalAgentsQuery),
      query(totalLeadsQuery),
      query(claimedLeadsQuery),
      query(unclaimedLeadsQuery),
      query(weeklyLeadsQuery),
      query(monthlyLeadsQuery)
    ]);

    return {
      totalAgents: parseInt(totalAgents.rows[0].count),
      totalLeads: parseInt(totalLeads.rows[0].count),
      claimedLeads: parseInt(claimedLeads.rows[0].count),
      unclaimedLeads: parseInt(unclaimedLeads.rows[0].count),
      weeklyLeads: parseInt(weeklyLeads.rows[0].count),
      monthlyLeads: parseInt(monthlyLeads.rows[0].count)
    };
  }
};

// Company Settings Queries
export const companySettingsQueries = {
  // Get setting by key
  get: async (key) => {
    const sql = 'SELECT * FROM company_settings WHERE setting_key = $1';
    const result = await query(sql, [key]);
    return result.rows[0];
  },

  // Set or update setting
  set: async (key, value) => {
    const sql = `
      INSERT INTO company_settings (setting_key, setting_value)
      VALUES ($1, $2)
      ON CONFLICT (setting_key)
      DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await query(sql, [key, value]);
    return result.rows[0];
  },

  // Get all settings
  getAll: async () => {
    const sql = 'SELECT * FROM company_settings ORDER BY setting_key';
    const result = await query(sql);
    return result.rows;
  }
};