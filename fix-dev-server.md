# Fix Dev Server Issues

## Quick Fixes:

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Clear Cache and Reinstall
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 3. Try Different Port
```bash
cd frontend
npm run dev -- --port 3001
```

### 4. Check if Port is in Use
```bash
netstat -ano | findstr :5173
```

### 5. Alternative Vite Config
Create/update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true
  }
})
```

### 6. Manual Start
If npm run dev fails, try:
```bash
cd frontend
npx vite
```

## Common Issues:

1. **Folder with spaces**: Consider renaming project folder to `verixo-sms-verification`
2. **Node version**: Ensure you're using Node.js 16+ 
3. **Windows path issues**: Use PowerShell as Administrator
4. **Antivirus blocking**: Temporarily disable antivirus for the project folder