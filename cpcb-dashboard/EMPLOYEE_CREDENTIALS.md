# Employee Login Credentials

## 🔐 Database Initialization

To initialize the database with employee accounts, visit:
```
http://localhost:3000/api/init-db
```

This will create 7 employee accounts with unique credentials.

---

## 👥 Employee Accounts

### Employees (Field Staff)

| Employee ID | Username | Password | Full Name | Department | Email |
|-------------|----------|----------|-----------|------------|-------|
| EMP-001 | emp001 | emp001@2024 | Rajesh Kumar | Water Quality Monitoring | rajesh.kumar@cpcb.gov.in |
| EMP-002 | emp002 | emp002@2024 | Priya Sharma | Industrial Compliance | priya.sharma@cpcb.gov.in |
| EMP-003 | emp003 | emp003@2024 | Amit Patel | Field Operations | amit.patel@cpcb.gov.in |
| EMP-004 | emp004 | emp004@2024 | Sneha Reddy | Data Analysis | sneha.reddy@cpcb.gov.in |
| EMP-005 | emp005 | emp005@2024 | Vikram Singh | Environmental Safety | vikram.singh@cpcb.gov.in |

### Supervisor

| Employee ID | Username | Password | Full Name | Department | Email |
|-------------|----------|----------|-----------|------------|-------|
| SUP-001 | supervisor | super@2024 | Dr. Meera Iyer | Quality Control | meera.iyer@cpcb.gov.in |

### Administrator

| Employee ID | Username | Password | Full Name | Department | Email |
|-------------|----------|----------|-----------|------------|-------|
| ADMIN-001 | admin | admin@2024 | Administrator | IT & Systems | admin@cpcb.gov.in |

---

## 🚀 Quick Start

### 1. Initialize Database
```bash
# Visit this URL in your browser:
http://localhost:3000/api/init-db

# Or use curl:
curl http://localhost:3000/api/init-db
```

Expected response:
```json
{
  "success": true,
  "message": "Database initialized successfully",
  "employeesCreated": 7,
  "employees": [...]
}
```

### 2. Login to Dashboard
```bash
# Visit:
http://localhost:3000/login

# Use any of the credentials above
# Example: emp001 / emp001@2024
```

### 3. Access Dashboard
After successful login, you'll be redirected to:
```
http://localhost:3000/dashboard
```

---

## 🔑 Login Features

### Login Page
- ✅ Username/password authentication
- ✅ MongoDB backend
- ✅ Bcrypt password hashing
- ✅ Session management (localStorage)
- ✅ Error handling
- ✅ Loading states
- ✅ Demo credentials display

### Dashboard
- ✅ Authentication required
- ✅ User info display (name, employee ID, role)
- ✅ Logout button
- ✅ Auto-redirect if not logged in

---

## 🗄️ MongoDB Collections

### users Collection
```javascript
{
  _id: ObjectId("..."),
  username: "emp001",
  password: "$2a$10$...", // bcrypt hashed
  role: "employee",
  employeeId: "EMP-001",
  fullName: "Rajesh Kumar",
  email: "rajesh.kumar@cpcb.gov.in",
  department: "Water Quality Monitoring",
  phone: "+91-9876543210",
  createdAt: ISODate("..."),
  isActive: true
}
```

### Indexes
- `username` (unique)
- `employeeId` (unique)
- `email` (unique)

---

## 🔐 Security Features

### Password Hashing
- ✅ Bcrypt with salt rounds: 10
- ✅ Passwords never stored in plain text
- ✅ Secure comparison during login

### Session Management
- ✅ User data stored in localStorage
- ✅ Auto-logout on session expiry
- ✅ Protected routes (dashboard requires auth)

### API Security
- ✅ POST-only for login
- ✅ Error messages don't reveal user existence
- ✅ Rate limiting ready (can be added)

---

## 📱 User Roles

### Employee
- Access to dashboard
- View alerts
- Submit readings
- Update alert status

### Supervisor
- All employee permissions
- Assign alerts to employees
- View team statistics
- Generate reports

### Admin
- All supervisor permissions
- Manage users
- System configuration
- Database management

---

## 🧪 Testing Login

### Test Employee Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"emp001","password":"emp001@2024"}'
```

Expected response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "username": "emp001",
    "role": "employee",
    "employeeId": "EMP-001",
    "fullName": "Rajesh Kumar"
  }
}
```

### Test Invalid Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"wrong"}'
```

Expected response:
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

## 🔄 Workflow

1. **User visits** http://localhost:3000
2. **Redirected to** /login (if not authenticated)
3. **Enters credentials** (e.g., emp001 / emp001@2024)
4. **API validates** against MongoDB
5. **User data stored** in localStorage
6. **Redirected to** /dashboard
7. **Dashboard displays** user info + logout button
8. **User clicks logout** → localStorage cleared → redirected to /login

---

## 📊 Dashboard Features (After Login)

- ✅ User info in header (name, employee ID, role)
- ✅ Logout button
- ✅ Real-time alerts from MongoDB
- ✅ Statistics (total, active, resolved)
- ✅ Top violators chart
- ✅ Recent alerts table
- ✅ AI model status

---

## 💡 Password Reset (Future)

To reset a password:

1. Connect to MongoDB
2. Hash new password:
   ```javascript
   const bcrypt = require('bcryptjs');
   const newHash = await bcrypt.hash('newpassword', 10);
   ```
3. Update user:
   ```javascript
   db.users.updateOne(
     { username: 'emp001' },
     { $set: { password: newHash } }
   );
   ```

---

## 🎯 Summary

**Total Employees**: 7 (5 employees + 1 supervisor + 1 admin)  
**Authentication**: MongoDB + Bcrypt  
**Session**: localStorage  
**Protected Routes**: Dashboard requires login  
**Login URL**: http://localhost:3000/login  
**Init DB URL**: http://localhost:3000/api/init-db  

**All credentials are ready to use immediately after database initialization!** 🎉
