const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Created tables:');
    console.log('   - system_users');
    console.log('   - field_agents');
    console.log('   - leads');
    console.log('   - company_settings');
    console.log('🔧 Created indexes and triggers');
    console.log('👤 Default super admin user created');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase();