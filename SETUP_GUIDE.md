# GulfVista.Properties - Setup & Troubleshooting Guide

## ✅ Quick Start (Recommended)

### Option 1: Automatic Startup (Windows)
1. Navigate to the `frontend` folder
2. **Double-click** `START_DEV_SERVER.bat`
3. Wait for the server to start
4. Open your browser to: **http://localhost:5173**

### Option 2: Manual Startup (Windows PowerShell/CMD)
```bash
cd C:\Users\DATA ENG. OLA\Desktop\gulfvista.properties\frontend
npm install
npm run dev
```

### Option 3: Manual Startup (Mac/Linux)
```bash
cd ~/Desktop/gulfvista.properties/frontend
npm install
npm run dev
```

---

## 🔧 Troubleshooting

### Issue 1: "npm command not found" or Node.js Error
**Solution:**
1. Download and install Node.js from: https://nodejs.org/
2. Choose the LTS (Long Term Support) version
3. Run the installer and accept all default options
4. Restart your terminal/command prompt
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Issue 2: "Site cannot be reached" or Connection Refused
**Solutions to try (in order):**

#### A. Check if server is actually running
- Look for "Local: http://localhost:5173" message in terminal
- If you see errors, scroll up to see what went wrong
- Check console for compilation errors

#### B. Clear npm cache and reinstall
```bash
cd C:\Users\DATA ENG. OLA\Desktop\gulfvista.properties\frontend
npm cache clean --force
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

#### C. Check if port 5173 is in use
```bash
# Windows (PowerShell)
Get-Process | Where-Object { $_.Listening -or $_.Owning } | Select-Object ProcessName, Id

# Or try different port
npm run dev -- --port 3000
```

Then access at: **http://localhost:3000**

#### D. Firewall issue
- Check Windows Firewall settings
- Temporarily disable firewall to test
- Add Node.js to firewall whitelist

### Issue 3: "Cannot find module" or Import Errors
**Solutions:**
```bash
# Clear and reinstall all dependencies
npm install --legacy-peer-deps

# Or use yarn instead
npm install -g yarn
yarn install
yarn dev
```

### Issue 4: Port Already in Use
If port 5173 is occupied by another application:

**Option A:** Kill the process using the port
```bash
# Windows PowerShell (as Administrator)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 5174
```

**Option B:** Edit `vite.config.ts` to use different port
```typescript
server: {
  port: 5174,  // Change from 5173 to another number
  strictPort: false,  // Allow fallback to different port
}
```

### Issue 5: CORS or API Errors
The frontend proxies API requests to `localhost:8000`. Make sure:
1. Backend server is running on port 8000
2. Backend allows cross-origin requests
3. Check browser console (F12) for CORS errors

**Temporary Fix:** Comment out API calls in App.jsx for frontend-only testing

---

## 📋 Access URLs

Once the dev server is running successfully, access the platform at:

| URL | Method |
|-----|--------|
| http://localhost:5173 | Direct Access |
| http://127.0.0.1:5173 | Loopback |
| http://<your-ip>:5173 | Network (replace with your IP) |

---

## 🧪 Testing Checklist

After the site loads, verify these features work:

- [ ] **Homepage loads** - See properties grid
- [ ] **Search works** - Type in search bar, see suggestions
- [ ] **Filters work** - Click "Advanced Filters", adjust and apply
- [ ] **Properties display** - Click property card to see details
- [ ] **Navigation menu** - Tools menu opens with all options
- [ ] **Modals work** - Click buttons to open modals (Agents, Valuation, etc.)
- [ ] **No console errors** - Press F12, check Console tab

---

## 🛠️ Advanced Commands

### Development Server
```bash
npm run dev              # Start with hot reload
npm run dev -- --port 3000  # Custom port
```

### Production Build
```bash
npm run build           # Create optimized build
npm run preview         # Preview production build
```

### Code Quality
```bash
npm run lint            # Check code quality
npm run type-check      # TypeScript validation
```

---

## 📊 Project Structure

```
frontend/
├── App.jsx              # Main component (7700+ lines)
├── main.jsx             # Entry point
├── index.html           # HTML template
├── index.css            # Global styles
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── ...
└── public/             # Static files
```

---

## 📦 Key Dependencies

- **React 18.2** - UI library
- **Vite 5.0** - Build tool & dev server
- **Tailwind CSS 3.3** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **TypeScript** - Type safety

---

## 🐛 Debug Mode

To see detailed error messages:

1. Open **Developer Tools** (F12)
2. Go to **Console** tab
3. Look for red error messages
4. Check **Network** tab to see API calls
5. Check **Application** tab for local storage

---

## 📞 Common Issues & Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| Port 5173 in use | Use different port or kill process |
| npm not found | Install Node.js |
| Module not found | Run `npm install` |
| Vite not running | Check for compilation errors in terminal |
| Blank page | Check console (F12) for errors |
| API not working | Ensure backend is running on port 8000 |

---

## ✨ Features Available After Startup

Once the site loads, you'll have access to:

### Property Browsing
- Browse 49+ properties
- Advanced filters (price, beds, baths, type, location, etc.)
- Search with auto-complete
- Recent searches history

### Tools Menu
- 🏦 Mortgage Calculator
- 📊 Investment ROI
- 🗺️ Property Map
- 📈 Market Insights
- 💰 Valuation Tool
- ⏱️ Drive Time Search
- 🤖 AI Advisor
- 🤖 AI Recommendations
- 📊 Advanced Analytics
- And more...

### Property Features
- Compare 2-4 properties
- Save to unlimited wishlists
- View property details
- Contact agents
- Write reviews
- View neighborhood info

### User Features
- Create favorites lists
- Get email alerts
- View user profile
- Track activity
- Manage preferences

---

## 🚀 Next Steps

1. Start the dev server using one of the methods above
2. Open http://localhost:5173 in your browser
3. Browse properties and test features
4. Report any errors using browser console (F12)
5. Check PLATFORM_STATUS_REPORT.md for feature details

---

## ❓ Still Having Issues?

1. Check the error message in the terminal where `npm run dev` is running
2. Copy the exact error message
3. Search the error online
4. Check Node.js version compatibility (should be v16+)
5. Try reinstalling Node.js and dependencies from scratch

---

**Last Updated:** May 23, 2026  
**Status:** Production Ready
