# 🚀 Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- MongoDB installed and running
- MongoDB Compass (optional, for viewing data)

## Setup Steps

### 1. Install MongoDB

**Windows:**
Download from: https://www.mongodb.com/try/download/community

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment

Backend `.env` is already configured with:
```env
MONGODB_URI=mongodb://localhost:27017/impulse
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🎯 Test the System

### 1. Visit Homepage
Open: `http://localhost:5173`

### 2. Register New User
- Click "Get Started" or "Sign In"
- Click "Sign up" link
- Fill the form:
  - Name: Your Name
  - Email: your@email.com
  - Password: password123
- Click "Create Account"

### 3. View Dashboard
You'll be automatically logged in and redirected to the dashboard.

### 4. Check MongoDB
Open MongoDB Compass:
- Connect to: `mongodb://localhost:27017`
- Database: `impulse`
- Collection: `users`
- You'll see your registered user!

## 📁 Project Structure

```
productivity/
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   └── .env                # Environment variables
│
├── frontend/               # React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   └── index.css      # Custom Tailwind library
│   └── package.json
│
└── Documentation files
```

## 🔐 Available Routes

### Frontend
- `/` - Homepage
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard (requires login)

### Backend API
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/updatedetails` - Update user (protected)
- `PUT /api/auth/updatepassword` - Change password (protected)
- `GET /api/auth/logout` - Logout user

## 🎨 Custom Tailwind Classes

Use these classes in your components:

```jsx
// Buttons
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>

// Cards
<div className="card-hover card-body">
  <h3 className="heading-4">Title</h3>
  <p className="text-body">Content</p>
</div>

// Containers
<div className="container-custom">
  <section className="section">
    {/* Content */}
  </section>
</div>
```

See `frontend/COMPONENT_LIBRARY.md` for full reference.

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process or change PORT in `.env`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check CLIENT_URL in backend `.env` matches frontend URL

## 📚 Documentation

- **Component Library**: `frontend/COMPONENT_LIBRARY.md`
- **Project Structure**: `frontend/PROJECT_STRUCTURE.md`
- **Backend Auth**: `backend/AUTH_SETUP.md`
- **Frontend Auth**: `frontend/AUTH_INTEGRATION.md`
- **Complete Guide**: `AUTHENTICATION_COMPLETE.md`

## 🎯 What's Next?

1. **Explore the Dashboard** - See user information and stats
2. **Build New Features** - Add tasks, projects, time tracking
3. **Customize UI** - Use the custom Tailwind classes
4. **Add More Pages** - Create new routes and components
5. **Extend Auth** - Add email verification, password reset

## 💡 Tips

- Use `useAuth()` hook to access user state anywhere
- Wrap new routes with `<ProtectedRoute>` to require login
- Check MongoDB Compass to see your data
- Use custom Tailwind classes for consistent styling
- Follow the project structure guidelines

## 🚀 You're Ready!

Everything is set up and working. Start building your productivity platform!

Happy coding! 🎉
