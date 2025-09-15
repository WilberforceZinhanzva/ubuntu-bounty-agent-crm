# Ubuntu Bounty - Agent CRM System

A comprehensive Customer Relationship Management (CRM) system designed for Ubuntu Bounty Company to manage field agents and track leads efficiently.

## 🚀 Features

### Dashboard
- **Real-time Statistics**: Total agents, weekly/monthly/all-time leads
- **Lead Status Tracking**: Claimed vs unclaimed leads
- **Quick Actions**: Add agents, leads, and export reports

### Field Agent Management
- Register field agents with contact details and locations
- Filter agents by location and registration date
- View agent profiles with complete lead history
- Agent dashboard showing numbers grouped by location

### Lead Management
- Comprehensive lead tracking with client information
- Interest level categorization (Low, Medium, High, Very High)
- Lead claiming functionality with assignee tracking
- Advanced filtering by client name, contact, or registration date
- Export capabilities (PDF, Excel, CSV)

### User Management (Super Admin)
- Role-based access control (Super Admin, View & Edit, View Only)
- User profile management with contact details
- Secure PIN-based authentication (Default: 2025)

### Settings & Configuration
- Company logo upload functionality
- System settings management
- Modern UI with blue and green color scheme

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon Postgres (Serverless)
- **Deployment**: Vercel
- **Icons**: Heroicons
- **Styling**: Tailwind CSS with custom design system

## 📦 Installation & Setup

### Prerequisites
- Node.js 18 or higher
- Neon Postgres database
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ubuntu-bounty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Neon database URL:
   ```
   DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

4. **Database Setup**
   ```bash
   npm run setup-db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Credentials
- **Email**: admin@ubuntubounty.com
- **PIN**: 2025

## 🚀 Deployment on Vercel

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Connect to Vercel**: 
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository

3. **Environment Variables**:
   Add these in Vercel project settings:
   - `DATABASE_URL`: Your Neon Postgres connection string
   - `NEXTAUTH_SECRET`: A random secret key
   - `NEXTAUTH_URL`: Your Vercel app URL

4. **Deploy**: Vercel will automatically build and deploy your application

## 📊 Database Schema

### Tables
- **system_users**: Application users with role-based permissions
- **field_agents**: Field agents who submit leads
- **leads**: Client leads with claim tracking
- **company_settings**: Application configuration

### Key Features
- **UUID Primary Keys**: For better security and scalability
- **Soft Deletes**: Data integrity with `is_active` flags
- **Automatic Timestamps**: Created/updated tracking
- **Optimized Indexes**: Fast queries on frequently accessed data
- **Connection Pooling**: Efficient database connections

## 🔐 Security Features

- **Role-Based Access Control**: Three user levels with different permissions
- **PIN Authentication**: Secure login system
- **SQL Injection Protection**: Parameterized queries
- **SSL Connections**: Encrypted database connections
- **Environment Variables**: Secure configuration management

## 📱 User Interface

### Design System
- **Colors**: Blue (#1e40af) and Green (#059669) theme
- **Typography**: Inter font family
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant interface elements

### User Experience
- **Intuitive Navigation**: Clear sidebar with role-based menu items
- **Real-time Updates**: Dynamic data loading and updates
- **Search & Filter**: Advanced filtering capabilities
- **Export Functions**: Multiple export formats (PDF, Excel, CSV)
- **Modal Forms**: Clean, focused data entry

## 🔧 Performance Optimizations

- **Connection Pooling**: Efficient database connection management
- **Strategic Indexing**: Optimized database queries
- **Serverless Architecture**: Auto-scaling with Vercel
- **Code Splitting**: Optimized bundle sizes
- **Caching**: Efficient data caching strategies

## 📈 Monitoring & Maintenance

### Health Checks
- Database connection monitoring
- API endpoint health checks
- Error logging and tracking

### Backup Strategy
- Automatic backups via Neon
- Point-in-time recovery available
- Data export capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed for Ubuntu Bounty Company.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

**Built with ❤️ for Ubuntu Bounty Company**