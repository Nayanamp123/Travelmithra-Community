# Travelmithra Community - Full Stack Setup Guide

## Overview
Travelmithra Community is a full-stack travel community platform with React frontend and Express.js backend using PostgreSQL.

## Project Structure
```
├── backend/          # Express.js server
│   ├── server.js     # Main server file with API endpoints
│   ├── package.json  # Backend dependencies
│   └── .env.example  # Environment variables template
└── frontend/         # React + TypeScript application
    ├── src/
    │   ├── api/
    │   │   └── client.ts  # API client for backend communication
    │   ├── pages/         # Page components
    │   └── ...
    ├── vite.config.ts
    └── package.json
```

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:
```env
PORT=4000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/travelmithra
NODE_ENV=development
```

### 3. Create PostgreSQL Database
```bash
createdb travelmithra
```

### 4. Start Backend Server
```bash
npm run dev
```

Backend will run at: `http://localhost:4000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile/:userId` - Update user profile
- `GET /api/users` - Get all users

### Community
- `GET /api/community` - Get community stats
- `GET /api/community/stories` - Get all stories
- `POST /api/community/stories` - Post a story
- `GET /api/community/tips` - Get all tips
- `POST /api/community/tips` - Post a tip

### Features & Support
- `GET /api/features` - Get all features
- `GET /api/support` - Get support info
- `POST /api/support/ticket` - Create support ticket
- `GET /api/support/tickets` - Get all support tickets

## Features

### User Management
- ✅ User Registration with profile picture
- ✅ User Login
- ✅ Profile Viewing
- ✅ Profile Editing (name, email, avatar)

### Community
- ✅ Share travel stories
- ✅ Share travel tips
- ✅ View community directory
- ✅ Community statistics

### Additional Features
- ✅ Destination Gallery
- ✅ Trip Planning
- ✅ Budget Tracker
- ✅ Travel Recommendations
- ✅ Community Reviews
- ✅ Travel Forums
- ✅ Support System

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Stories Table
```sql
CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  author VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Tips Table
```sql
CREATE TABLE tips (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  author VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Support Tickets Table
```sql
CREATE TABLE support_tickets (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(255),
  description TEXT,
  email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Frontend Components

### Pages
- **Home** - Landing page
- **Register** - User registration with backend API
- **Login** - User login with backend API
- **Dashboard** - User dashboard
- **Profile** - View user profile with edit button
- **EditProfile** - Edit user profile (name, email, avatar)
- **Community** - Community features
- **Features** - Available features
- **Support** - Support page with ticket creation

### API Client (`src/api/client.ts`)
All frontend components use the centralized API client for backend communication:

```typescript
import { authAPI, profileAPI, communityAPI } from './api/client';

// Register
const result = await authAPI.register(name, email, password);

// Update Profile
const result = await profileAPI.updateProfile(userId, name, email, avatar);

// Get Stories
const stories = await communityAPI.getStories();
```

## Running Both Services

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Then open: `http://localhost:5173`

## Testing the Application

### 1. Register a New User
- Go to Register page
- Fill in name, email, password, and optionally upload a profile picture
- Click "Register"

### 2. Edit Profile
- Click on your profile
- Click "Edit Profile" button
- Update your name, email, or profile picture
- Click "Update Profile"

### 3. Share Stories
- Go to Community page
- Share your travel stories

### 4. Share Tips
- Go to Community page
- Share travel tips with the community

## Troubleshooting

### Backend Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Check if port 4000 is available

### Frontend Connection Issues
- Ensure backend is running on `http://localhost:4000`
- Check browser console for CORS errors
- Verify API endpoint URLs in `src/api/client.ts`

### CORS Errors
The backend is configured to accept requests from `http://localhost:5173` (Vite frontend).
To allow other origins, update the CORS configuration in `server.js`.

## Next Steps

- Add JWT authentication tokens
- Implement user avatar storage (S3/Cloudinary)
- Add email verification
- Implement password reset functionality
- Add more community features
- Deploy to production

## Support
For issues or questions, create a support ticket through the Support page.

---
Happy traveling with Travelmithra Community! 🌍✈️
