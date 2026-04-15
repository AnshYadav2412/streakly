# Streakly Deployment Guide 🚀

Complete guide to deploy your Streakly PWA to production.

## Pre-Deployment Checklist

### 1. Convert PNG Icon ⚠️ IMPORTANT
```bash
# The pwa-192x192.png is currently a placeholder
# Convert it using one of these methods:

# Option A: Online (Easiest)
# 1. Go to https://cloudconvert.com/svg-to-png
# 2. Upload frontend/public/pwa-icon.svg
# 3. Set dimensions to 192x192
# 4. Download and replace frontend/public/pwa-192x192.png

# Option B: ImageMagick (if installed)
cd frontend/public
convert pwa-icon.svg -resize 192x192 pwa-192x192.png
```

### 2. Environment Variables

Create `.env` files for both frontend and backend:

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

**Frontend (.env)**
```env
VITE_API_URL=https://your-backend-url.com
```

### 3. Update API URL in Frontend

If using environment variables, update your API calls:
```javascript
// frontend/src/context/AuthContext.jsx and HabitContext.jsx
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Frontend Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? streakly-frontend
# - Directory? ./
# - Override settings? No

# For production:
vercel --prod
```

**Backend Deployment:**
```bash
# Deploy backend
cd backend
vercel

# Add environment variables in Vercel dashboard:
# - Go to project settings
# - Environment Variables
# - Add MONGODB_URI, JWT_SECRET, etc.
```

**Configure:**
1. Go to Vercel dashboard
2. Add environment variables
3. Update frontend API_URL to backend URL
4. Redeploy frontend

### Option 2: Netlify

**Frontend:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
cd frontend
npm run build

# Deploy
netlify deploy

# For production:
netlify deploy --prod
```

**Backend:**
- Deploy to Heroku, Railway, or Render (see below)
- Update frontend API_URL

### Option 3: Railway (Full Stack)

**Backend:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up

# Add environment variables:
railway variables set MONGODB_URI="your_uri"
railway variables set JWT_SECRET="your_secret"
```

**Frontend:**
```bash
cd frontend
railway init
railway up
```

### Option 4: Heroku

**Backend:**
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
cd backend
heroku create streakly-backend

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET="your_secret"

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

**Frontend:**
- Deploy to Vercel or Netlify (easier for static sites)

### Option 5: DigitalOcean App Platform

1. Go to DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure:
   - **Backend**: Node.js app, port 5000
   - **Frontend**: Static site, build command `npm run build`
4. Add environment variables
5. Deploy!

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Create database user
# 4. Whitelist IP (0.0.0.0/0 for all IPs)
# 5. Get connection string
# 6. Add to backend .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streakly?retryWrites=true&w=majority
```

### Option 2: Self-Hosted MongoDB
```bash
# Install MongoDB locally or on VPS
# Update connection string:
MONGODB_URI=mongodb://localhost:27017/streakly
```

## Build Commands

### Frontend
```bash
cd frontend
npm install
npm run build
# Output: dist/ folder
```

### Backend
```bash
cd backend
npm install
# No build needed for Node.js
# Start with: npm start
```

## Testing Production Build Locally

### Frontend
```bash
cd frontend
npm run build
npm run preview
# Visit http://localhost:4173
```

### Backend
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

### Test PWA Features
1. Open preview URL in Chrome
2. Check DevTools > Application
3. Verify service worker is registered
4. Test install functionality
5. Test offline mode (airplane mode)

## Post-Deployment

### 1. Update CORS Settings
```javascript
// backend/src/index.js
const corsOptions = {
  origin: [
    'https://your-frontend-url.vercel.app',
    'http://localhost:5173', // Keep for local dev
  ],
  credentials: true,
};
app.use(cors(corsOptions));
```

### 2. Test Everything
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] User registration works
- [ ] User login works
- [ ] Habits CRUD operations work
- [ ] Analytics display correctly
- [ ] PWA installs successfully
- [ ] Offline mode works
- [ ] Mobile responsive
- [ ] Icons display correctly

### 3. Configure Custom Domain (Optional)

**Vercel:**
```bash
vercel domains add yourdomain.com
# Follow DNS instructions
```

**Netlify:**
```bash
netlify domains:add yourdomain.com
# Follow DNS instructions
```

### 4. Enable HTTPS
- Most platforms enable HTTPS automatically
- Verify SSL certificate is active
- Test PWA install (requires HTTPS)

## Monitoring & Maintenance

### Analytics (Optional)
```bash
# Add Google Analytics or Plausible
# Add to frontend/index.html
```

### Error Tracking (Optional)
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in frontend/src/main.jsx
```

### Backup Database
```bash
# MongoDB Atlas: Automatic backups
# Self-hosted: Set up cron job
mongodump --uri="your_connection_string" --out=/backup/
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues
- Check CORS settings
- Verify API URL in frontend
- Check environment variables
- Test API endpoints directly

### PWA Not Installing
- Verify HTTPS is enabled
- Check manifest.json loads
- Verify service worker registers
- Check browser console for errors

### Database Connection Fails
- Verify MongoDB URI
- Check IP whitelist
- Verify database user credentials
- Test connection string locally

## Environment-Specific Configs

### Development
```javascript
// frontend/vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

### Production
```javascript
// Use environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## Cost Estimates

### Free Tier (Perfect for Starting)
- **Frontend**: Vercel/Netlify (Free)
- **Backend**: Railway/Render (Free tier)
- **Database**: MongoDB Atlas (Free 512MB)
- **Total**: $0/month

### Paid Tier (For Growth)
- **Frontend**: Vercel Pro ($20/month)
- **Backend**: Railway ($5-20/month)
- **Database**: MongoDB Atlas ($9/month)
- **Total**: ~$34-49/month

## Security Checklist

- [ ] Environment variables not in code
- [ ] JWT secret is strong and random
- [ ] MongoDB credentials are secure
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Rate limiting enabled (optional)
- [ ] Input validation on backend
- [ ] XSS protection enabled

## Performance Optimization

### Frontend
```bash
# Already optimized with:
# - Vite build optimization
# - PWA caching
# - Code splitting
# - Asset optimization
```

### Backend
```javascript
// Add compression
npm install compression
// In index.js:
const compression = require('compression');
app.use(compression());
```

## Continuous Deployment

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Quick Deploy Commands

### Full Stack Deploy (Vercel + Railway)
```bash
# Backend
cd backend
railway up

# Frontend (update API_URL first!)
cd frontend
vercel --prod
```

### Update Deployment
```bash
# Frontend
cd frontend
git add .
git commit -m "Update"
vercel --prod

# Backend
cd backend
git add .
git commit -m "Update"
railway up
```

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [PWA Deployment Guide](https://web.dev/pwa-checklist/)

---

## Quick Start (TL;DR)

```bash
# 1. Convert PNG icon (see above)

# 2. Deploy backend to Railway
cd backend
railway login
railway init
railway up
railway variables set MONGODB_URI="your_uri"
railway variables set JWT_SECRET="your_secret"

# 3. Update frontend API URL
# Edit frontend/.env:
# VITE_API_URL=https://your-backend-url.railway.app

# 4. Deploy frontend to Vercel
cd frontend
vercel --prod

# 5. Test!
# Visit your Vercel URL
# Try installing as PWA
# Test on mobile device
```

---

**You're ready to deploy! 🚀**

Choose your platform, follow the steps, and your Streakly PWA will be live in minutes!
