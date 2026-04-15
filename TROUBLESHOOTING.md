# Troubleshooting Guide 🔧

Common issues and solutions for Streakly development and deployment.

## Development Issues

### ❌ Error: Failed to resolve import "react-is"

**Error Message:**
```
[plugin:vite:import-analysis] Failed to resolve import "react-is" from "node_modules/.vite/deps/recharts.js"
```

**Cause:** Missing `react-is` dependency required by Recharts library.

**Solution:**
```bash
cd frontend
npm install react-is --legacy-peer-deps
rm -rf node_modules/.vite  # Clear Vite cache
npm run dev
```

**Why it happens:** Recharts depends on `react-is` but it's not always installed automatically due to peer dependency conflicts with Vite 8.

---

### ❌ Error: ERESOLVE could not resolve

**Error Message:**
```
npm error ERESOLVE could not resolve
npm error peer vite@"^3.1.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0" from vite-plugin-pwa@1.2.0
```

**Cause:** Version conflict between Vite 8 and vite-plugin-pwa which expects Vite 7 or lower.

**Solution:**
Always use `--legacy-peer-deps` flag when installing packages:
```bash
npm install <package-name> --legacy-peer-deps
```

**Why it happens:** We're using Vite 8 (latest) but some plugins haven't updated their peer dependencies yet. The `--legacy-peer-deps` flag allows npm to ignore peer dependency version conflicts.

---

### ❌ Port Already in Use

**Error Message:**
```
Port 5173 is in use, trying another one...
```

**Solution:**
Vite automatically tries the next available port (5174, 5175, etc.). This is normal behavior.

**To use a specific port:**
```bash
# vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

**To kill process on port:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

### ❌ Vite Cache Issues

**Symptoms:**
- Old code still running after changes
- Import errors after installing packages
- Stale dependencies

**Solution:**
```bash
cd frontend
rm -rf node_modules/.vite
rm -rf dist
npm run dev
```

**For persistent issues:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

---

### ❌ MongoDB Connection Failed

**Error Message:**
```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solutions:**

1. **Check MongoDB is running:**
```bash
# If using local MongoDB
mongod --version
# Start MongoDB service
```

2. **Check connection string:**
```env
# backend/.env
MONGODB_URI=mongodb://localhost:27017/streakly
# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streakly
```

3. **Check IP whitelist (Atlas):**
- Go to MongoDB Atlas dashboard
- Network Access > Add IP Address
- Add `0.0.0.0/0` (allow all) for development

4. **Check credentials:**
- Verify username and password
- Ensure user has read/write permissions

---

### ❌ CORS Error

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```javascript
// backend/src/index.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-production-url.com'
  ],
  credentials: true,
};
app.use(cors(corsOptions));
```

**For development, allow all origins:**
```javascript
app.use(cors({
  origin: true,
  credentials: true
}));
```

---

### ❌ JWT Token Invalid

**Error Message:**
```
401 Unauthorized - Invalid token
```

**Solutions:**

1. **Check JWT_SECRET is set:**
```bash
# backend/.env
JWT_SECRET=your_very_long_and_secure_secret_key_here
```

2. **Clear localStorage:**
```javascript
// In browser console
localStorage.clear()
// Then login again
```

3. **Check token expiration:**
```javascript
// backend/src/utils/generateToken.js
// Increase expiration time if needed
expiresIn: '30d'
```

---

## Build Issues

### ❌ Build Fails with Memory Error

**Error Message:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

### ❌ PWA Service Worker Not Registering

**Symptoms:**
- No service worker in DevTools
- Install prompt doesn't appear
- Offline mode doesn't work

**Solutions:**

1. **Check HTTPS:**
PWAs require HTTPS in production (localhost is exempt)

2. **Check browser support:**
```javascript
// In browser console
if ('serviceWorker' in navigator) {
  console.log('Service Worker supported');
} else {
  console.log('Service Worker NOT supported');
}
```

3. **Clear service workers:**
```
DevTools > Application > Service Workers > Unregister
DevTools > Application > Clear storage > Clear site data
```

4. **Check for errors:**
```
DevTools > Console
DevTools > Application > Service Workers
```

5. **Verify plugin configuration:**
```javascript
// vite.config.js
VitePWA({
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true  // Enable in dev mode
  }
})
```

---

### ❌ Icons Not Displaying

**Symptoms:**
- Blank icon on home screen
- Default browser icon showing
- Manifest errors in DevTools

**Solutions:**

1. **Convert PNG icon:**
```bash
# The pwa-192x192.png must be a real PNG, not text file
# Use online converter: https://cloudconvert.com/svg-to-png
```

2. **Check icon paths:**
```javascript
// vite.config.js manifest
icons: [
  {
    src: '/pwa-192x192.png',  // Must exist in public/
    sizes: '192x192',
    type: 'image/png'
  }
]
```

3. **Verify files exist:**
```bash
ls frontend/public/pwa-*.png
ls frontend/public/favicon.svg
```

4. **Clear cache and reinstall:**
- Uninstall PWA
- Clear browser cache
- Reload page
- Reinstall PWA

---

## Deployment Issues

### ❌ Environment Variables Not Working

**Symptoms:**
- API calls fail in production
- Features work locally but not deployed
- Undefined environment variables

**Solutions:**

1. **Frontend (Vite):**
```env
# Must start with VITE_
VITE_API_URL=https://api.example.com
```

```javascript
// Access in code
const apiUrl = import.meta.env.VITE_API_URL
```

2. **Backend (Node):**
```env
# No prefix needed
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secret123
```

```javascript
// Access in code
const mongoUri = process.env.MONGODB_URI
```

3. **Platform-specific:**
- **Vercel:** Add in Project Settings > Environment Variables
- **Netlify:** Add in Site Settings > Environment Variables
- **Railway:** Use `railway variables set KEY=value`
- **Heroku:** Use `heroku config:set KEY=value`

---

### ❌ API Calls Fail in Production

**Symptoms:**
- 404 errors on API calls
- Network errors
- CORS errors

**Solutions:**

1. **Check API URL:**
```javascript
// Should point to production backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

2. **Update CORS:**
```javascript
// backend/src/index.js
const corsOptions = {
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
};
```

3. **Check backend is running:**
```bash
curl https://your-backend-url.com/api/health
```

4. **Check network tab:**
- Open DevTools > Network
- Look for failed requests
- Check request URL and response

---

### ❌ Database Connection Fails in Production

**Solutions:**

1. **Check IP whitelist:**
- MongoDB Atlas > Network Access
- Add deployment platform IPs
- Or use `0.0.0.0/0` (less secure)

2. **Check connection string:**
```env
# Use SRV connection string for Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

3. **Check environment variable:**
```bash
# Verify it's set on platform
railway variables
# or
heroku config
# or check platform dashboard
```

---

## Performance Issues

### ❌ Slow Initial Load

**Solutions:**

1. **Enable compression:**
```javascript
// backend/src/index.js
const compression = require('compression');
app.use(compression());
```

2. **Optimize images:**
- Use WebP format
- Compress images
- Use appropriate sizes

3. **Code splitting:**
```javascript
// Already enabled with Vite
// Use lazy loading for routes
const Analytics = lazy(() => import('./pages/Analytics'));
```

4. **Check bundle size:**
```bash
npm run build
# Check dist/ folder size
```

---

### ❌ Slow API Responses

**Solutions:**

1. **Add database indexes:**
```javascript
// backend/src/models/Habit.js
habitSchema.index({ user: 1, createdAt: -1 });
```

2. **Optimize queries:**
```javascript
// Use lean() for read-only queries
const habits = await Habit.find({ user: userId }).lean();
```

3. **Add caching:**
```javascript
// Use Redis or in-memory cache
const cache = new Map();
```

---

## Testing Issues

### ❌ Can't Test PWA Locally

**Solutions:**

1. **Enable dev mode:**
```javascript
// vite.config.js
VitePWA({
  devOptions: {
    enabled: true
  }
})
```

2. **Use production build:**
```bash
npm run build
npm run preview
```

3. **Use ngrok for HTTPS:**
```bash
npm install -g ngrok
ngrok http 5173
# Use HTTPS URL for testing
```

---

### ❌ Install Prompt Not Showing

**Solutions:**

1. **Check criteria:**
- Must be HTTPS (or localhost)
- Must have valid manifest
- Must have service worker
- User must engage with site first

2. **Check browser:**
- Chrome/Edge: Best support
- Firefox: Limited support
- Safari: No install prompt (use Share > Add to Home Screen)

3. **Force show (dev only):**
```javascript
// In browser console
window.dispatchEvent(new Event('beforeinstallprompt'));
```

---

## Common Questions

### Q: Why use --legacy-peer-deps?

**A:** We're using Vite 8 (latest) but some plugins like `vite-plugin-pwa` haven't updated their peer dependencies yet. The flag allows installation despite version mismatches. The plugins still work correctly.

### Q: Do I need to convert the PNG icon?

**A:** Yes! The `pwa-192x192.png` is currently a text placeholder. Convert the SVG to PNG for proper icon display on all devices, especially iOS.

### Q: Why doesn't PWA work on iOS like Android?

**A:** iOS has limited PWA support. Features like install prompts, push notifications, and background sync don't work. Basic features (install via Share menu, offline mode) do work.

### Q: Can I use a different port?

**A:** Yes! Edit `vite.config.js` and add:
```javascript
server: { port: 3000 }
```

### Q: How do I update the PWA after deployment?

**A:** The service worker auto-updates! Just deploy new code. Users will see an update prompt on next visit.

---

## Getting Help

If you're still stuck:

1. **Check browser console** (F12) for errors
2. **Check network tab** for failed requests
3. **Check DevTools > Application** for PWA issues
4. **Review documentation files** in project root
5. **Check MongoDB logs** for database issues
6. **Verify environment variables** are set correctly

## Quick Fixes Checklist

- [ ] Clear Vite cache: `rm -rf node_modules/.vite`
- [ ] Clear browser cache and reload
- [ ] Check all environment variables are set
- [ ] Verify MongoDB connection string
- [ ] Check CORS configuration
- [ ] Verify API URL in frontend
- [ ] Check service worker in DevTools
- [ ] Convert PNG icon from SVG
- [ ] Use --legacy-peer-deps for npm install
- [ ] Check browser console for errors

---

**Most issues can be solved by:**
1. Clearing caches
2. Checking environment variables
3. Verifying URLs and connection strings
4. Reading error messages carefully

Good luck! 🚀
