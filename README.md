# Ubuntu Bounty - Lead Management System

A comprehensive React web application for managing field agents and client leads for Ubuntu Bounty Company.

## Features

### 🏢 Dashboard
- **Real-time Statistics**: Total agents, weekly/monthly/all-time leads
- **Lead Status Tracking**: Claimed vs unclaimed leads
- **Agent Distribution**: View agents grouped by location
- **Recent Activity**: Track latest lead submissions

### 👥 Agent Management
- **Agent Registration**: Full name, contact details, email, location (all optional)
- **Agent Profiles**: View complete agent information and lead history
- **Search & Filter**: Filter by location, registration date, or search by name/contact
- **Agent Dashboard**: Visual representation of agents by location

### 🎯 Lead Management
- **Lead Creation**: Client details, contact info, location, interest level (all optional)
- **Lead Assignment**: Associate leads with specific agents
- **Status Management**: Claim/unclaim leads with assignee tracking
- **Advanced Filtering**: Search by client name, contact, date, or agent
- **Export Options**: Download data as PDF, Excel, or CSV formats
- **Claimed Leads Report**: Separate export for claimed leads with assignee details

### 👤 User Management (Super Admin Only)
- **User Creation**: Name, contact details, email, role assignment
- **Permission System**: View-only or View+Edit rights
- **PIN Management**: Customizable login credentials (default: 2025)
- **User Profiles**: Edit user details and permissions
- **Account Security**: PIN visibility toggle and secure authentication

### ⚙️ Settings
- **Company Branding**: Upload and manage company logo
- **System Information**: Application details and current user info
- **Design Theme**: Modern blue and green color scheme
- **Security Overview**: Data storage and backup information

## Technical Specifications

### 🛠️ Built With
- **React 18.2.0** - Modern React with hooks and context
- **React Router 6** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **jsPDF & jsPDF-AutoTable** - PDF generation
- **XLSX** - Excel file generation
- **Date-fns** - Date manipulation utilities

### 🎨 Design Features
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Modern UI**: Clean, professional interface with gradient backgrounds
- **Color Scheme**: Blue and green theme as specified
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Loading States**: Smooth user experience with loading indicators

### 🔒 Security Features
- **PIN Authentication**: Secure login system (default PIN: 2025)
- **Role-based Access**: Super Admin and User roles with different permissions
- **Local Storage**: Client-side data persistence
- **Input Validation**: Form validation and error handling
- **XSS Protection**: Safe HTML rendering and input sanitization

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or download the project files**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

### Default Login
- **PIN:** 2025
- **Default User:** Super Admin (created automatically on first login)

## Usage Guide

### Getting Started
1. **Login** with PIN 2025
2. **Add Agents** in the Agent Management section
3. **Create Leads** and assign them to agents
4. **Track Progress** on the dashboard
5. **Export Data** as needed for reporting

### User Roles
- **Super Admin**: Full system access including user management
- **User**: Limited access based on assigned permissions (view/edit/delete)

### Data Management
- All data is stored locally in browser localStorage
- Use export functions to backup important data
- Data persists between browser sessions
- Clear browser data will reset the application

## File Structure

```
src/
├── components/
│   ├── Login.js              # Authentication component
│   ├── Dashboard.js          # Main dashboard with statistics
│   ├── AgentManagement.js    # Agent CRUD operations
│   ├── LeadManagement.js     # Lead CRUD and status management
│   ├── UserManagement.js     # User administration (Super Admin)
│   ├── Settings.js           # System configuration
│   └── Navbar.js            # Navigation component
├── context/
│   ├── AuthContext.js        # Authentication state management
│   └── DataContext.js        # Application data management
├── App.js                    # Main application component
├── index.js                  # Application entry point
└── index.css                 # Global styles and theme
```

## Performance Optimizations

- **Efficient Rendering**: React hooks and context for state management
- **Memory Management**: Proper cleanup and event listener removal
- **File Size Limits**: 5MB limit for logo uploads
- **Lazy Loading**: Components loaded on demand
- **Optimized Exports**: Efficient PDF and Excel generation

## Browser Compatibility

- **Chrome** (recommended)
- **Firefox**
- **Safari**
- **Edge**
- **Mobile browsers** (responsive design)

## Troubleshooting

### Common Issues
1. **Data Loss**: Export data regularly as backup
2. **Performance**: Clear browser cache if application becomes slow
3. **Login Issues**: Ensure PIN is exactly "2025"
4. **Export Problems**: Check browser popup blockers

### Support
For technical support or feature requests, please contact the development team.

## License

This application is proprietary software developed for Ubuntu Bounty Company.

---

**Ubuntu Bounty Lead Management System v1.0.0**  
*Built with ❤️ using React*