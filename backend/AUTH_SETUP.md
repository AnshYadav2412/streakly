# Authentication System Setup Guide

## 🔐 Overview

Complete authentication system with JWT tokens and MongoDB storage.

## 📋 Prerequisites

1. **MongoDB Compass** installed and running
2. MongoDB running on `mongodb://localhost:27017`

## 🚀 Quick Start

### 1. Install MongoDB Compass

Download from: https://www.mongodb.com/try/download/compass

### 2. Start MongoDB

Make sure MongoDB is running locally on port 27017.

### 3. Configure Environment Variables

Update `.env` file:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/impulse

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d

# Client URL
CLIENT_URL=http://localhost:5173
```

### 4. Start Backend Server

```bash
npm run dev
```

The server will automatically connect to MongoDB and create the database.

## 📊 Database Structure

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  role: String (enum: ['user', 'admin']),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Update User Details
```http
PUT /api/auth/updatedetails
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### Logout
```http
GET /api/auth/logout
```

## 🔒 Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Protected Routes**: Middleware to protect routes requiring authentication
4. **Role-Based Access**: Support for user roles (user, admin)
5. **CORS Configuration**: Configured for frontend origin
6. **Input Validation**: Email format and password length validation

## 🛡️ Middleware

### `protect` Middleware

Protects routes requiring authentication:

```javascript
const { protect } = require('../middleware/auth');

router.get('/protected', protect, controller);
```

### `authorize` Middleware

Restricts access based on user roles:

```javascript
const { protect, authorize } = require('../middleware/auth');

router.delete('/admin-only', protect, authorize('admin'), controller);
```

## 📁 File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Auth logic
│   ├── middleware/
│   │   └── auth.js              # Auth middleware
│   ├── models/
│   │   └── User.js              # User model
│   ├── routes/
│   │   └── authRoutes.js        # Auth routes
│   ├── utils/
│   │   └── generateToken.js     # JWT token generator
│   └── index.js                 # Entry point
├── .env                         # Environment variables
└── package.json
```

## 🧪 Testing with MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. You'll see the `impulse` database
4. View the `users` collection to see registered users
5. Passwords are hashed and cannot be read directly

## 🔧 Common Issues

### MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is running
- Check if port 27017 is available
- Verify MONGODB_URI in .env file

### JWT Token Invalid

**Error:** `Not authorized to access this route`

**Solution:**
- Check if token is being sent in Authorization header
- Verify JWT_SECRET matches between requests
- Token may have expired (default 30 days)

## 🚀 Production Deployment

1. **Change JWT_SECRET** to a strong random string
2. **Update MONGODB_URI** to production database
3. **Set NODE_ENV** to `production`
4. **Enable HTTPS** for secure token transmission
5. **Configure CORS** for production domain

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/impulse |
| JWT_SECRET | Secret key for JWT | random_secret_string |
| JWT_EXPIRE | Token expiration | 30d |
| CLIENT_URL | Frontend URL | http://localhost:5173 |

## 🎯 Next Steps

1. Add email verification
2. Implement password reset functionality
3. Add OAuth providers (Google, GitHub)
4. Implement refresh tokens
5. Add rate limiting
6. Add two-factor authentication
