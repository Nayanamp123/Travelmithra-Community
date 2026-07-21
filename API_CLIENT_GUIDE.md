# API Client Usage Guide

## Overview
The API client (`src/api/client.ts`) provides a centralized way to communicate with the backend. All API calls are organized into logical groups.

---

## Authentication API

### Register User
```typescript
import { authAPI } from '../api/client';

try {
  const response = await authAPI.register(name, email, password);
  console.log('User registered:', response.user);
  // response = {
  //   message: "User registered successfully",
  //   user: { id: 1, name: "John", email: "john@example.com" }
  // }
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### Login User
```typescript
import { authAPI } from '../api/client';

try {
  const response = await authAPI.login(email, password);
  console.log('Login successful:', response.user);
  // response = {
  //   message: "Login successful",
  //   user: { id: 1, name: "John", email: "john@example.com", avatar: "..." }
  // }
} catch (error) {
  console.error('Login failed:', error.message);
}
```

---

## Profile API

### Get User Profile
```typescript
import { profileAPI } from '../api/client';

try {
  const profile = await profileAPI.getProfile(userId);
  console.log('Profile:', profile);
  // {
  //   id: 1,
  //   name: "John",
  //   email: "john@example.com",
  //   avatar: "data:image/png;base64,..."
  // }
} catch (error) {
  console.error('Failed to fetch profile:', error.message);
}
```

### Update User Profile
```typescript
import { profileAPI } from '../api/client';

try {
  const response = await profileAPI.updateProfile(
    userId,
    newName,
    newEmail,
    avatarBase64 // optional
  );
  console.log('Profile updated:', response.user);
} catch (error) {
  console.error('Failed to update profile:', error.message);
}
```

### Get All Users
```typescript
import { profileAPI } from '../api/client';

try {
  const users = await profileAPI.getAllUsers();
  console.log('All users:', users);
  // [
  //   { id: 1, name: "John", email: "john@example.com", avatar: "..." },
  //   { id: 2, name: "Jane", email: "jane@example.com", avatar: "..." }
  // ]
} catch (error) {
  console.error('Failed to fetch users:', error.message);
}
```

---

## Community API

### Get Community Stats
```typescript
import { communityAPI } from '../api/client';

try {
  const stats = await communityAPI.getCommunityStats();
  console.log('Community stats:', stats);
} catch (error) {
  console.error('Failed to fetch community stats:', error.message);
}
```

### Get All Stories
```typescript
import { communityAPI } from '../api/client';

try {
  const stories = await communityAPI.getStories();
  console.log('Stories:', stories);
  // [
  //   { id: 1, title: "My Trip to Paris", content: "...", author: "John", created_at: "..." },
  //   { id: 2, title: "Tokyo Adventure", content: "...", author: "Jane", created_at: "..." }
  // ]
} catch (error) {
  console.error('Failed to fetch stories:', error.message);
}
```

### Post a Story
```typescript
import { communityAPI } from '../api/client';

try {
  const response = await communityAPI.postStory(
    "My Amazing Trip",
    "I had an amazing experience in...",
    "John"
  );
  console.log('Story posted:', response);
  // {
  //   id: 3,
  //   message: "Story posted successfully"
  // }
} catch (error) {
  console.error('Failed to post story:', error.message);
}
```

### Get All Tips
```typescript
import { communityAPI } from '../api/client';

try {
  const tips = await communityAPI.getTips();
  console.log('Tips:', tips);
  // [
  //   { id: 1, title: "Budget Travel Tips", content: "...", author: "John", created_at: "..." }
  // ]
} catch (error) {
  console.error('Failed to fetch tips:', error.message);
}
```

### Post a Tip
```typescript
import { communityAPI } from '../api/client';

try {
  const response = await communityAPI.postTip(
    "How to Save Money While Traveling",
    "Here are some tips to save money...",
    "Jane"
  );
  console.log('Tip posted:', response);
} catch (error) {
  console.error('Failed to post tip:', error.message);
}
```

---

## Features API

### Get All Features
```typescript
import { featuresAPI } from '../api/client';

try {
  const features = await featuresAPI.getFeatures();
  console.log('Features:', features);
  // [
  //   {
  //     id: 1,
  //     name: "Destination Gallery",
  //     description: "Browse curated collections..."
  //   }
  // ]
} catch (error) {
  console.error('Failed to fetch features:', error.message);
}
```

---

## Support API

### Get Support Info
```typescript
import { supportAPI } from '../api/client';

try {
  const supportInfo = await supportAPI.getSupportInfo();
  console.log('Support info:', supportInfo);
  // {
  //   email: "support@travelmithra.com",
  //   phone: "+1-800-TRAVEL-1",
  //   hours: "Monday - Friday, 9AM - 6PM UTC",
  //   faqCount: 45,
  //   ticketResolutionTime: "24 hours"
  // }
} catch (error) {
  console.error('Failed to fetch support info:', error.message);
}
```

### Get Support Tickets
```typescript
import { supportAPI } from '../api/client';

try {
  const tickets = await supportAPI.getTickets();
  console.log('Tickets:', tickets);
  // [
  //   {
  //     id: 1,
  //     subject: "Issue with profile",
  //     description: "...",
  //     email: "user@example.com",
  //     status: "open",
  //     created_at: "..."
  //   }
  // ]
} catch (error) {
  console.error('Failed to fetch tickets:', error.message);
}
```

### Create Support Ticket
```typescript
import { supportAPI } from '../api/client';

try {
  const response = await supportAPI.createTicket(
    "Payment not processing",
    "I'm having trouble completing my payment. Error: ...",
    "user@example.com"
  );
  console.log('Ticket created:', response);
  // {
  //   ticketId: 5,
  //   message: "Support ticket created"
  // }
} catch (error) {
  console.error('Failed to create ticket:', error.message);
}
```

---

## Error Handling Pattern

```typescript
import { authAPI } from '../api/client';
import { useState } from 'react';

export function MyComponent() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(email, password);
      // Handle success
      console.log('Logged in:', response.user);
    } catch (err) {
      // Handle error
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={() => handleLogin('user@example.com', 'password')} disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </div>
  );
}
```

---

## Adding New API Endpoints

To add a new API endpoint:

1. **Add to backend** (`backend/server.js`):
```javascript
app.get('/api/new-endpoint', async (req, res) => {
  try {
    // Your logic here
    res.json({ data: 'response' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});
```

2. **Add to client** (`frontend/src/api/client.ts`):
```typescript
export const newAPI = {
  getNewData: async () => {
    const response = await fetch(`${API_BASE_URL}/new-endpoint`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  },
};
```

3. **Use in component**:
```typescript
import { newAPI } from '../api/client';

const data = await newAPI.getNewData();
```

---

## API Configuration

Change API base URL in `src/api/client.ts`:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
```

Then create `.env.local`:
```env
REACT_APP_API_URL=http://api.example.com/api
```

---

## Rate Limiting & Best Practices

- ✅ Always use try-catch for API calls
- ✅ Show loading states during requests
- ✅ Display user-friendly error messages
- ✅ Validate input before API calls
- ✅ Use the centralized API client
- ✅ Don't make multiple calls for same data
- ✅ Consider caching responses

---

## Authentication Token Support (Future)

When JWT tokens are implemented:

```typescript
// Store token after login
localStorage.setItem('authToken', response.token);

// Add to API client headers
const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});
```

---

Happy coding! 🚀
