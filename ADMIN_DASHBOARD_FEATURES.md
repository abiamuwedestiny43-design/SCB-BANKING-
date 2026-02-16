# First State Bank - Admin Dashboard Features

## 🎯 Overview

The Admin Dashboard is a comprehensive control center for managing the entire banking system, users, transactions, and security settings.

---

## 🔐 Access Information

### Login Credentials

- **URL**: `http://localhost:3000/login`
- **Email**: `admin@firststatebank.com`
- **Password**: `Admin@123456`
- **PIN**: `1234`

**⚠️ IMPORTANT**: Change these credentials after first login for security!

---

## 📊 Dashboard Statistics (Real-time)

### 1. **Global Accounts**

- **Icon**: Users icon (Orange)
- **Displays**: Total number of registered users
- **Description**: Active user base
- **Link**: `/admin/users`
- **Features**:
  - View all registered users
  - Search and filter users
  - Verify user accounts
  - Approve role changes
  - Delete users (except admin users)

### 2. **Total Volume**

- **Icon**: Transfer icon (Blue)
- **Displays**: Total number of transfers processed
- **Description**: Historical transfers
- **Link**: `/admin/transactions`
- **Features**:
  - View all transactions
  - Monitor transfer status
  - Track pending approvals
  - Review transaction history

### 3. **Issued Assets**

- **Icon**: Credit Card icon (Purple)
- **Displays**: Total active cards issued
- **Description**: Total active cards
- **Link**: `/admin/cards`
- **Features**:
  - View all issued cards
  - Manage card status
  - Issue new cards
  - Deactivate cards

### 4. **Pending Vetting**

- **Icon**: Lightning icon (Orange)
- **Displays**: Users awaiting verification
- **Description**: Awaiting approval
- **Link**: `/admin/users?filter=pending`
- **Features**:
  - Review pending verifications
  - Approve/reject user accounts
  - KYC verification management

---

## ⚡ Quick Actions

### 1. **Security Codes Management**

- **Link**: `/admin/transfer-codes`
- **Purpose**: Manage transfer security codes
- **Codes Managed**:
  - **COT** (Cost of Transfer)
  - **IMF** (International Monetary Fund code)
  - **TAC** (Tax Authorization Code)
- **Features**:
  - Set code values
  - Enable/disable code requirements
  - Track code usage

### 2. **System Settings**

- **Link**: `/admin/settings`
- **Purpose**: Edit global configuration
- **Features**:
  - Enable/disable local transfers
  - Configure system-wide settings
  - Manage banking parameters
  - Update security policies

---

## 📈 Recent Activity Log

### Real-time Activity Monitoring

- **ADMIN_ACCESS**: Tracks admin login events
- **TRANSFER**: Logs global transfer activities
- **USER_KYC**: Records new KYC submissions
- **Timestamps**: Shows time elapsed for each activity

---

## 🌍 Global Balance Heatmap

### System Monitoring

- **Purpose**: Monitor real-time assets across regions
- **Metrics Displayed**:
  - **Active Users**: Shows active regions (12/12)
  - **Response Time**: System performance (14MS)
- **Visual**: Globe icon with interactive hover effects

---

## 🏥 System Health Monitor

### Core Services Status

All services show operational status with health percentages:

1. **Core Database**
   - Status: Operational
   - Health: 100%
   - Purpose: Main database connectivity

2. **Transfer System**
   - Status: Operational
   - Health: 98%
   - Purpose: Transaction processing

3. **Auth Services**
   - Status: Operational
   - Health: 100%
   - Purpose: User authentication

4. **Asset Liquidity**
   - Status: Nominal
   - Health: 94%
   - Purpose: Fund availability

### Security Advisory

- Real-time security alerts
- Unauthorized access detection
- 24-hour security cycle monitoring

---

## 🛠️ Additional Admin Features

### User Management (`/admin/users`)

- ✅ View all users in a table format
- ✅ Search users by name, email, or account number
- ✅ Filter by verification status
- ✅ Create new users manually
- ✅ Edit user details
- ✅ Verify user accounts
- ✅ Approve role changes
- ✅ Delete users (protection for admin accounts)
- ✅ View detailed user profiles

### Transaction Management (`/admin/transactions`)

- ✅ View all transfers
- ✅ Monitor pending transfers
- ✅ Approve/reject transfers
- ✅ Track transfer codes (COT, IMF, TAC)
- ✅ View transaction details
- ✅ Export transaction reports

### Card Management (`/admin/cards`)

- ✅ View all issued cards
- ✅ Issue new cards to users
- ✅ Activate/deactivate cards
- ✅ Set card limits
- ✅ Track card usage
- ✅ Manage card types (Debit, Credit, Virtual)

### Loan Management (`/admin/loans`)

- ✅ View all loan applications
- ✅ Approve/reject loans
- ✅ Set loan terms
- ✅ Track repayment status
- ✅ Manage loan types

### Transfer Codes (`/admin/transfer-codes`)

- ✅ Set COT (Cost of Transfer) codes
- ✅ Set IMF (International Monetary Fund) codes
- ✅ Set TAC (Tax Authorization Code)
- ✅ Enable/disable code requirements
- ✅ Track code verification status

### Settings (`/admin/settings`)

- ✅ Enable/disable local transfers
- ✅ Configure global banking parameters
- ✅ Manage security settings
- ✅ Update system configurations

---

## 🎨 Design Features

### Visual Elements

- **Dark Theme**: Professional dark background (#020617)
- **Gradient Accents**: Orange and blue gradients
- **Hover Effects**: Interactive card animations
- **Responsive Design**: Works on all screen sizes
- **Icons**: Lucide React icons throughout
- **Status Indicators**: Color-coded health bars

### Color Coding

- **Orange**: Primary actions and users
- **Blue**: Transactions and transfers
- **Purple**: Cards and assets
- **Orange**: Pending items and alerts
- **Green**: Success states
- **Red**: Errors and deletions

---

## 🔒 Security Features

### Admin Protection

- ✅ Admin users cannot be deleted
- ✅ Role-based access control
- ✅ Secure authentication with PIN
- ✅ Session management
- ✅ Activity logging

### Audit Trail

- ✅ All admin actions are logged
- ✅ User verification tracking
- ✅ Transfer approval history
- ✅ Security event monitoring

---

## 📱 Navigation Structure

```
/admin (Dashboard)
├── /admin/users (User Management)
│   ├── /admin/users/create (Create New User)
│   └── /admin/users/[id] (User Details)
│       └── /admin/users/[id]/edit (Edit User)
├── /admin/transactions (Transaction Management)
├── /admin/cards (Card Management)
├── /admin/loans (Loan Management)
├── /admin/transfer-codes (Security Codes)
└── /admin/settings (System Settings)
```

---

## 🚀 Quick Start Guide

### 1. Login

1. Navigate to `http://localhost:3000/login`
2. Enter admin credentials
3. Enter PIN when prompted
4. You'll be redirected to `/admin`

### 2. Common Tasks

#### Verify a User

1. Go to Dashboard → Click "Pending Vetting" card
2. Select user to verify
3. Click "Verify Account"
4. Confirm action

#### Approve a Transfer

1. Go to Transactions
2. Filter by "Pending"
3. Review transfer details
4. Approve or reject

#### Issue a Card

1. Go to Cards
2. Click "Issue New Card"
3. Select user
4. Choose card type
5. Set limits
6. Confirm issuance

#### Manage Transfer Codes

1. Go to Transfer Codes
2. Set code values (COT, IMF, TAC)
3. Enable/disable as needed
4. Save changes

---

## 📊 Reports & Analytics

### Available Reports

- User growth statistics
- Transaction volume reports
- Card issuance metrics
- Pending approval summaries
- System health reports

### Export Options

- CSV export for user data
- Transaction history exports
- Card usage reports

---

## 🎯 Best Practices

### Security

1. **Change default credentials** immediately
2. **Use strong passwords** (min 12 characters)
3. **Enable 2FA** when available
4. **Regular security audits**
5. **Monitor activity logs** daily

### User Management

1. **Verify users promptly** to improve experience
2. **Review KYC documents** thoroughly
3. **Approve role changes** carefully
4. **Monitor suspicious activity**

### Transaction Oversight

1. **Review large transfers** manually
2. **Check for fraud patterns**
3. **Approve transfers within 24 hours**
4. **Maintain audit trail**

---

## 🆘 Support & Troubleshooting

### Common Issues

**Can't login?**

- Verify credentials are correct
- Check if PIN is 4 digits
- Clear browser cache
- Try incognito mode

**Dashboard not loading?**

- Check if dev server is running (`npm run dev`)
- Verify MongoDB connection
- Check browser console for errors

**Users not showing?**

- Verify database connection
- Check MongoDB Atlas access
- Refresh the page

---

## 📞 Contact Information

For technical support or questions:

- **Email**: <admin@firststatebank.com>
- **Dashboard**: <http://localhost:3000/admin>
- **Documentation**: This file

---

## 🔄 Version Information

- **Platform**: First State Bank Admin Panel
- **Version**: 1.0.0
- **Last Updated**: 2026-02-14
- **Framework**: Next.js 14
- **Database**: MongoDB

---

**🎉 You now have complete control over your banking system!**
