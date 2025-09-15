-- Ubuntu Bounty Database Schema
-- Run this script in your Neon Postgres database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create System Users table
CREATE TABLE IF NOT EXISTS system_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone_number_1 VARCHAR(20),
    phone_number_2 VARCHAR(20),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('super_admin', 'view_only', 'view_edit')),
    login_pin VARCHAR(10) NOT NULL DEFAULT '2025',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Field Agents table
CREATE TABLE IF NOT EXISTS field_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255),
    contact_detail_1 VARCHAR(20),
    contact_detail_2 VARCHAR(20),
    email VARCHAR(255),
    agent_location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES field_agents(id) ON DELETE CASCADE,
    client_full_name VARCHAR(255),
    client_contact_1 VARCHAR(20),
    client_contact_2 VARCHAR(20),
    client_email VARCHAR(255),
    client_location VARCHAR(255),
    client_interest_level VARCHAR(50) CHECK (client_interest_level IN ('low', 'medium', 'high', 'very_high')),
    is_claimed BOOLEAN DEFAULT false,
    claimed_by VARCHAR(255),
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Company Settings table
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_field_agents_location ON field_agents(agent_location);
CREATE INDEX IF NOT EXISTS idx_field_agents_created_at ON field_agents(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_is_claimed ON leads(is_claimed);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_client_name ON leads(client_full_name);
CREATE INDEX IF NOT EXISTS idx_leads_client_contact ON leads(client_contact_1, client_contact_2);
CREATE INDEX IF NOT EXISTS idx_system_users_email ON system_users(email);
CREATE INDEX IF NOT EXISTS idx_system_users_user_type ON system_users(user_type);

-- Insert default super admin user
INSERT INTO system_users (name, surname, email, user_type, login_pin)
VALUES ('Super', 'Admin', 'admin@ubuntubounty.com', 'super_admin', '2025')
ON CONFLICT (email) DO NOTHING;

-- Insert default company logo setting
INSERT INTO company_settings (setting_key, setting_value)
VALUES ('company_logo', '')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_system_users_updated_at BEFORE UPDATE ON system_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_field_agents_updated_at BEFORE UPDATE ON field_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();