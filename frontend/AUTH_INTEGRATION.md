# Frontend Authentication Integration

## 🔐 Overview

React authentication system integrated with the backend API using Context API and axios.

## 📦 Components

### 1. AuthContext (`src/context/AuthContext.jsx`)

Global authentication state management using React Context.

**Features:**
- User state management
- Login/Register/Logout functions
- Token storage in localStorage
- Automatic user loading on app start
- Error handling

**Usage:**
```jsx
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout, loading } = useAuth();
  
  // Use auth functions
};
```

### 2. ProtectedRoute (`src/components/ProtectedRoute.jsx`)

Route wrapper that requires authentication.

**Usage:**
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### 3. Pages

#### Login (`src/pages/Login.jsx`)
- Email and password login
- Error handling
- Remember me checkbox
- Link to register page

#### Register (`src/pages/Register.jsx`)
- Name, email, password registration
- Password confirmation
- Client-side validation
- Link to login page

#### Dashboard (`src/pages/Dashboard.jsx`)
- Protected page
- Displays user information
- Logout functionality
- Stats overview

## 🔌 API Integration

### Base Configuration

```javascript
const API_URL = 'http://localhost:5000/api/auth';
axios.defaults.withCredentials = true;
```

### Authentication Functions

#### Register
```javascript
const { register } = useAuth();

const result = await register(name, email, password);
if (result.success) {
  // Registration successful
} else {
  // Handle error: result.message
}
```

#### Login
```javascript
const { login } = useAuth();

const result = await login(email, password);
if (result.success) {
  // Login successful
} else {
  // Handle error: result.message
}
```

#### Logout
```javascript
const { logout } = useAuth();

await logout();
// User is logged out, token removed
```

#### Update User
```javascript
const { updateUser } = useAuth();

const result = await updateUser(name, email);
if (result.success) {
  // Update successful
}
```

#### Update Password
```javascript
const { updatePassword } = useAuth();

const result = await updatePassword(currentPassword, newPassword);
if (result.success) {
  // Password updated
}
```

## 🔒 Token Management

### Storage
Tokens are stored in `localStorage`:
```javascript
localStorage.setItem('token', token);
localStorage.getItem('token');
localStorage.removeItem('token');
```

### Authorization Header
Tokens are sent in the Authorization header:
```javascript
headers: {
  Authorization: `Bearer ${token}`
}
```

## 🎨 UI Components

### Form Styling
All forms use custom Tailwind classes:
```jsx
<input className="input" />
<button className="btn-primary">Submit</button>
```

### Error Display
```jsx
{error && (
  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
    {error}
  </div>
)}
```

### Loading States
```jsx
<button disabled={loading} className="btn-primary">
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## 🛣️ Routing

### App.jsx Routes
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

### Navigation
```jsx
import { Link, useNavigate } from 'react-router-dom';

// Link component
<Link to="/login">Sign In</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate('/dashboard');
```

## 🔄 User Flow

### Registration Flow
1. User fills registration form
2. Client validates password match
3. API call to `/api/auth/register`
4. Token stored in localStorage
5. User state updated
6. Redirect to dashboard

### Login Flow
1. User enters credentials
2. API call to `/api/auth/login`
3. Token stored in localStorage
4. User state updated
5. Redirect to dashboard

### Protected Route Access
1. User tries to access protected route
2. ProtectedRoute checks for user
3. If no user, redirect to login
4. If user exists, render component

### Logout Flow
1. User clicks logout
2. API call to `/api/auth/logout`
3. Token removed from localStorage
4. User state cleared
5. Redirect to login

## 🎯 State Management

### User State
```javascript
{
  _id: string,
  name: string,
  email: string,
  role: string,
  token: string
}
```

### Loading State
```javascript
loading: boolean  // true while checking authentication
```

### Error State
```javascript
error: string | null  // error message or null
```

## 🔧 Configuration

### API URL
Update in `AuthContext.jsx`:
```javascript
const API_URL = 'http://localhost:5000/api/auth';
```

For production:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://api.yourapp.com/api/auth';
```

### CORS
Backend must allow frontend origin:
```javascript
cors({
  origin: 'http://localhost:5173',
  credentials: true
})
```

## 🐛 Debugging

### Check Token
```javascript
console.log(localStorage.getItem('token'));
```

### Check User State
```javascript
const { user } = useAuth();
console.log('Current user:', user);
```

### Network Requests
Open browser DevTools → Network tab to see API calls

## 🚀 Production Checklist

- [ ] Update API_URL to production endpoint
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Add error tracking (Sentry, etc.)
- [ ] Implement token refresh
- [ ] Add loading skeletons
- [ ] Add form validation library (Formik, React Hook Form)
- [ ] Add toast notifications
- [ ] Implement remember me functionality
- [ ] Add password strength indicator

## 📝 Example Usage

### Complete Login Component
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};
```

## 🎨 Styling

All authentication pages use:
- Glassmorphism cards (`glass` class)
- Gradient backgrounds
- Custom input styles (`input` class)
- Custom button styles (`btn-primary`, `btn-outline`)
- Responsive design (mobile-first)

## 🔐 Security Best Practices

1. ✅ Tokens stored in localStorage (consider httpOnly cookies for production)
2. ✅ Passwords never stored in state longer than necessary
3. ✅ HTTPS required in production
4. ✅ CORS properly configured
5. ✅ Input validation on both client and server
6. ✅ Error messages don't reveal sensitive information
