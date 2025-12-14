# Deployment Guide

This guide explains how to deploy updates to your Bali Spa Guide application on Digital Ocean.

## Quick Start

The easiest way to deploy is using the automated deployment script:

```bash
./deploy.sh
```

That's it! The script will:
1. ✅ Commit your local changes
2. ✅ Push to GitHub
3. ✅ Pull latest code on the server
4. ✅ Update dependencies
5. ✅ Rebuild frontend
6. ✅ Restart backend
7. ✅ Deploy to production
8. ✅ Run health checks

---

## Usage Options

### Option 1: Simple Deployment (Interactive)
```bash
./deploy.sh
```
The script will ask you for a commit message if there are changes.

### Option 2: With Commit Message
```bash
./deploy.sh "Add new spa filtering feature"
```
Provide your commit message as an argument.

### Option 3: Quick Update
```bash
./deploy.sh "Quick fix"
```
Use for minor updates.

---

## What the Script Does

### Step 1: Git Operations (Local)
- Adds all changed files
- Shows you what will be committed
- Creates a commit with your message
- Pushes to GitHub main branch

### Step 2: Server Deployment
The script SSHs into your Digital Ocean server and:

1. **Pulls Latest Code**
   ```bash
   cd ~/balispaguidw_react
   git pull origin main
   ```

2. **Updates Backend**
   ```bash
   cd backend
   npm ci --omit=dev
   pm2 restart bali-backend
   ```

3. **Builds Frontend**
   ```bash
   cd frontend
   npm ci
   VITE_API_BASE=http://170.64.148.27 npm run build
   ```

4. **Deploys Frontend**
   ```bash
   rsync -a --delete dist/ /var/www/balispaguide/
   systemctl reload nginx
   ```

5. **Health Checks**
   - Tests backend API
   - Shows PM2 status

---

## Prerequisites

Before using the deployment script, make sure:

1. **SSH Access is configured**
   ```bash
   ssh root@170.64.148.27
   ```
   Should work without asking for password (using SSH keys)

2. **Git is configured**
   ```bash
   git remote -v
   ```
   Should show: `origin git@github.com:mohdazlanabas/balispaguide_react.git`

3. **You're on the main branch**
   ```bash
   git branch
   ```
   Should show: `* main`

---

## Manual Deployment (If Script Fails)

If the automated script doesn't work, you can deploy manually:

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Step 2: SSH into Server
```bash
ssh root@170.64.148.27
```

### Step 3: Pull and Deploy
```bash
cd ~/balispaguidw_react

# Pull latest code
git pull origin main

# Update backend
cd backend
npm ci --omit=dev
pm2 restart bali-backend
pm2 save

# Build and deploy frontend
cd ../frontend
npm ci
VITE_API_BASE=http://170.64.148.27 npm run build
rsync -a --delete dist/ /var/www/balispaguide/

# Reload nginx
systemctl reload nginx

# Check status
pm2 status
pm2 logs bali-backend --lines 20
```

---

## Troubleshooting

### Problem: "Permission denied (publickey)"
**Solution**: SSH keys not set up
```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy to server
ssh-copy-id root@170.64.148.27
```

### Problem: "Git push requires authentication"
**Solution**: Use SSH URL for GitHub
```bash
git remote set-url origin git@github.com:mohdazlanabas/balispaguide_react.git
```

### Problem: "npm ci failed" on server
**Solution**: Clear npm cache and retry
```bash
ssh root@170.64.148.27
cd ~/balispaguidw_react/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problem: Backend not starting
**Solution**: Check PM2 logs
```bash
ssh root@170.64.148.27
pm2 logs bali-backend --err --lines 50
```

Common issues:
- Missing environment variables (check `.env` file)
- Port 4000 already in use
- Module not found (run `npm ci` again)

### Problem: Frontend shows old version
**Solution**: Clear browser cache
- Hard refresh: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

### Problem: "Build failed" during frontend build
**Solution**: Check if VITE_API_BASE is set correctly
```bash
ssh root@170.64.148.27
cd ~/balispaguidw_react/frontend
VITE_API_BASE=http://170.64.148.27 npm run build
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Test changes locally first
- [ ] Check no console errors
- [ ] Verify all features work
- [ ] Review git changes: `git status`
- [ ] Write descriptive commit message
- [ ] Run the deployment script
- [ ] Verify deployment succeeded
- [ ] Test live site: http://170.64.148.27
- [ ] Check backend logs: `ssh root@170.64.148.27 'pm2 logs bali-backend'`

---

## Monitoring After Deployment

### Check Application Status
```bash
ssh root@170.64.148.27 'pm2 status'
```

### View Live Logs
```bash
ssh root@170.64.148.27 'pm2 logs bali-backend'
```

### Check Error Logs Only
```bash
ssh root@170.64.148.27 'pm2 logs bali-backend --err'
```

### View Nginx Logs
```bash
ssh root@170.64.148.27 'tail -f /var/log/nginx/access.log'
ssh root@170.64.148.27 'tail -f /var/log/nginx/error.log'
```

---

## Rollback (If Something Goes Wrong)

If the deployment breaks something, you can rollback:

### Option 1: Quick Rollback (Revert Last Commit)
```bash
# Locally
git revert HEAD
git push origin main

# Then deploy again
./deploy.sh "Rollback to previous version"
```

### Option 2: Rollback to Specific Commit
```bash
# Find the commit hash you want to rollback to
git log --oneline -10

# Rollback locally
git revert <commit-hash>
git push origin main

# Deploy
./deploy.sh "Rollback to working version"
```

### Option 3: Emergency Rollback on Server
```bash
ssh root@170.64.148.27

cd ~/balispaguidw_react

# Go back to previous commit
git reset --hard HEAD~1

# Rebuild and deploy
cd frontend
npm run build
rsync -a --delete dist/ /var/www/balispaguide/

cd ../backend
pm2 restart bali-backend
```

---

## Best Practices

1. **Always test locally first**
   ```bash
   npm run dev  # in frontend directory
   npm start    # in backend directory
   ```

2. **Deploy during low-traffic times**
   - Deployment takes 2-3 minutes
   - Site may be briefly unavailable

3. **Write clear commit messages**
   - ✅ Good: "Add email validation to booking form"
   - ❌ Bad: "update"

4. **Check logs after deployment**
   ```bash
   ssh root@170.64.148.27 'pm2 logs bali-backend --lines 50'
   ```

5. **Keep dependencies updated**
   - Run `npm audit` locally
   - Update packages regularly

6. **Backup before major changes**
   ```bash
   # Backup database (if you add one later)
   ssh root@170.64.148.27
   pg_dump dbname > backup.sql
   ```

---

## Production URLs

- **Main Site**: http://170.64.148.27
- **API Base**: http://170.64.148.27/api
- **Health Check**: http://170.64.148.27/api/filters

---

## Configuration Files

Important files for deployment:

- `deploy.sh` - Main deployment script
- `backend/.env` - Backend environment variables (email config, etc.)
- `frontend/.env` - Frontend environment variables (for local dev)
- `.gitignore` - Files not tracked by git
- `backend/server.js` - Backend entry point
- `frontend/vite.config.js` - Frontend build configuration

---

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the logs: `pm2 logs bali-backend`
3. Check GitHub Actions (if set up)
4. Review recent commits: `git log --oneline -10`
5. Test locally to isolate the issue

---

## Summary

**For most deployments, just run:**
```bash
./deploy.sh "Your commit message here"
```

The script handles everything automatically! 🚀
