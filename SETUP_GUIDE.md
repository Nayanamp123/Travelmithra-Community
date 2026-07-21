# Travelmithra - Complete Backend Integration Guide

## ✅ What's Been Done

### Backend (`/backend`)
- ✅ **User Authentication** - Register and Login endpoints
- ✅ **User Profile Management** - Get, Update profile with avatar support
- ✅ **Community Features** - Stories and tips sharing
- ✅ **Support System** - Ticket creation and tracking
- ✅ **Database Integration** - PostgreSQL with automatic table creation
- ✅ **CORS Configuration** - Frontend-backend communication enabled
- ✅ **API Documentation** - All endpoints documented

### Frontend (`/frontend`)
- ✅ **API Client** - Centralized API service (`src/api/client.ts`)
- ✅ **Register Page** - Connects to backend, password support, avatar upload
- ✅ **Login Page** - Backend authentication with error handling
- ✅ **Edit Profile Page** - Full profile editing with backend sync
- ✅ **Profile Page** - View and edit profile with navigation
- ✅ **App State Management** - Handles userId and user data
- ✅ **Error Handling** - User-friendly error messages throughout

---

## 🚀 Quick Start

### 1. Setup Backend

**Install dependencies:**
```bash
cd backend
npm install
```

**Create `.env` file:**
```bash
cp .env.example .env
```

**Update `.env` with your PostgreSQL details:**
```env
PORT=4000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/travelmithra
NODE_ENV=development
```

**Start backend server:**
```bash
npm run dev
```

✅ Backend running at: `http://localhost:4000`

### 2. Setup Frontend

**Install dependencies:**
```bash
cd frontend
npm install
```

**Start frontend server:**
```bash
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## 📝 Testing the Application

### Register a New User
1. Open `http://localhost:5173`
2. Click "Register"
3. Fill in:
   - Display name
   - Email
   - Password
   - Profile picture (optional)
4. Click "Register"
5. Should redirect to dashboard

### Login
1. Click "Login"
2. Enter email and password (from registration)
3. Click "Login"
4. Should redirect to dashboard

### Edit Profile
1. Click "Profile" in sidebar
2. Click "Edit Profile"
3. Update name, email, or profile picture
4. Click "Update Profile"
5. Changes saved to database

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
```

### User Profile
```
GET    /api/profile/:userId    - Get user profile
PUT    /api/profile/:userId    - Update user profile
GET    /api/users              - Get all users
```

### Community
```
GET    /api/community          - Get community stats
GET    /api/community/stories  - Get all stories
POST   /api/community/stories  - Create story
GET    /api/community/tips     - Get all tips
POST   /api/community/tips     - Create tip
```

### Support
```
GET    /api/support            - Get support info
GET    /api/support/tickets    - Get all tickets
POST   /api/support/ticket     - Create support ticket
```

### Features
```
GET    /api/features           - Get all features
```

---

## 📁 File Structure

### Backend Files Modified
```
backend/
├── server.js          (Updated with auth, profile, community endpoints)
├── package.json       (Added bcryptjs, cors)
└── .env.example       (New environment template)
```

### Frontend Files Modified
```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts               (New - API service)
│   ├── pages/
│   │   ├── Register.tsx            (Updated - API integration)
│   │   ├── Login.tsx               (Updated - API integration)
│   │   ├── EditProfile.tsx         (Updated - API integration)
│   │   └── Profile.tsx             (Updated - navigation to edit)
│   └── App.tsx                     (Updated - userId handling)
└── README.md                       (Project documentation)
```

---

## 🛠️ Features Implemented

### User Management
| Feature | Status | Implementation |
|---------|--------|-----------------|
| Register with password | ✅ | Backend validates, stores hashed password |
| Login with email/password | ✅ | Backend authentication with credentials |
| User profile view | ✅ | Displays user info from database |
| Edit profile (name, email) | ✅ | Backend updates with validation |
| Upload profile picture | ✅ | Stored as base64 in database |
| Persistent user sessions | ✅ | Frontend maintains currentUser state |

### Community Features
| Feature | Status | Backend |
|---------|--------|---------|
| Share stories | ✅ | POST/GET community/stories |
| Share tips | ✅ | POST/GET community/tips |
| View community directory | ✅ | GET /api/users |
| Community stats | ✅ | GET /api/community |

### Support System
| Feature | Status | Backend |
|---------|--------|---------|
| Create support tickets | ✅ | POST /api/support/ticket |
| View tickets | ✅ | GET /api/support/tickets |
| Support information | ✅ | GET /api/support |

---

## 🔐 Security Notes

**Current Implementation:**
- Passwords are hashed using SHA-256 (basic security)
- Email uniqueness enforced at database level
- CORS configured to accept only frontend origin
- Input validation on both client and server

**For Production, Add:**
- JWT token authentication
- HTTPS/SSL encryption
- Bcryptjs for stronger password hashing (already in package.json)
- Rate limiting
- CSRF protection
- Helmet.js for security headers
- Input sanitization

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill process on port 4000 (macOS/Linux)
kill -9 $(lsof -t -i:4000)

# Check database connection
# Ensure PostgreSQL is running and DATABASE_URL is correct
```

### Frontend API Errors
```bash
# Ensure backend is running on http://localhost:4000
# Check browser console for CORS errors
# Verify API_BASE_URL in src/api/client.ts
```

### Database Errors
```bash
# Recreate database
createdb travelmithra

# Check database connection
psql postgresql://user:password@localhost:5432/travelmithra
```

---

## 📚 Next Steps

1. **Deploy Backend** - Use Heroku, Railway, or AWS
2. **Deploy Frontend** - Use Vercel or Netlify
3. **Add JWT Tokens** - For better authentication
4. **Add Email Verification** - Send verification emails
5. **Implement Password Reset** - Forgot password functionality
6. **Add Image Storage** - Use S3 or Cloudinary for avatars
7. **Add User Following** - Follow/unfollow other travelers
8. **Add Notifications** - Real-time notifications for interactions
9. **Add Search** - Search for users, stories, tips
10. **Add Ratings/Reviews** - Rate destinations and tips

---

## 💡 Quick Command Reference

### Backend
```bash
cd backend
npm install      # Install dependencies
npm run dev      # Start server
```

### Frontend
```bash
cd frontend
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
```

---

## 📞 Support

For issues:
1. Check the README.md in root directory
2. Review API documentation above
3. Check browser console for errors
4. Check terminal output for backend errors
5. Ensure all services are running

---

**Happy Traveling! 🌍✈️**
