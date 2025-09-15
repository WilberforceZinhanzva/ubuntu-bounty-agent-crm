# Ubuntu Bounty - Database Setup Guide

## Prerequisites

1. **Neon Postgres Database**: Create a database on [Neon](https://neon.tech/)
2. **Vercel Account**: For deployment
3. **Node.js**: Version 18 or higher

## Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Neon database connection string:
   ```
   DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Run the database setup script to create all tables and initial data:

```bash
npm run setup-db
```

This will:
- Create all required tables (system_users, field_agents, leads, company_settings)
- Set up indexes for optimal performance
- Create triggers for automatic timestamp updates
- Insert default super admin user
- Insert default company settings

### 4. Verify Database Setup

After running the setup script, you should see:
- ✅ Database setup completed successfully!
- 📊 Created tables: system_users, field_agents, leads, company_settings
- 🔧 Created indexes and triggers
- 👤 Default super admin user created

## Database Schema

### Tables Created:

1. **system_users**: Application users with different permission levels
2. **field_agents**: Field agents who submit leads
3. **leads**: Client leads submitted by field agents
4. **company_settings**: Application configuration settings

### Default Data:

- **Super Admin User**: 
  - Email: admin@ubuntubounty.com
  - PIN: 2025
  - Type: super_admin

## Deployment on Vercel

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Connect to Vercel**: 
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository

3. **Environment Variables**:
   - In Vercel project settings, add your environment variables:
   - `DATABASE_URL`: Your Neon Postgres connection string
   - `NEXTAUTH_SECRET`: A random secret key
   - `NEXTAUTH_URL`: Your Vercel app URL

4. **Deploy**: Vercel will automatically deploy your application

## Database Queries

The application includes pre-built query functions in `lib/database-queries.js`:

- **systemUsersQueries**: User management operations
- **fieldAgentsQueries**: Field agent operations
- **leadsQueries**: Lead management operations
- **dashboardQueries**: Dashboard statistics
- **companySettingsQueries**: Application settings

## Performance Optimizations

- **Connection Pooling**: Uses pg Pool for efficient database connections
- **Indexes**: Strategic indexes on frequently queried columns
- **Prepared Statements**: All queries use parameterized statements
- **Connection Limits**: Configured for Vercel's serverless environment

## Security Features

- **SSL Connections**: Enforced for production
- **SQL Injection Protection**: Parameterized queries
- **Connection Timeouts**: Prevents hanging connections
- **Environment Variables**: Sensitive data stored securely

## Troubleshooting

### Common Issues:

1. **Connection Timeout**: Check your DATABASE_URL format
2. **SSL Errors**: Ensure `sslmode=require` is in your connection string
3. **Permission Errors**: Verify your Neon database user has proper permissions

### Logs:

Check Vercel function logs for database connection issues:
```bash
vercel logs
```

## Maintenance

### Backup:
Neon provides automatic backups. For manual backups:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Monitoring:
- Monitor connection pool usage
- Check query performance in Neon dashboard
- Set up alerts for connection limits

## Support

For database-related issues:
1. Check Neon dashboard for connection status
2. Verify environment variables in Vercel
3. Review application logs for specific error messages