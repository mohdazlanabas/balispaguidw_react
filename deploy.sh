#!/bin/bash

# Deployment script for Bali Spa Guide
# This script commits changes, pushes to GitHub, and deploys to Digital Ocean
# Usage: ./deploy.sh [commit-message]

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
DROPLET_IP="170.64.148.27"
DROPLET_USER="root"
PROJECT_DIR="balispaguidw_react"

echo -e "${BLUE}🚀 Starting deployment to Digital Ocean...${NC}\n"

# Step 1: Check for changes and commit to GitHub
echo -e "${YELLOW}📤 Step 1: Checking for changes...${NC}"
git add .

if git diff-index --quiet HEAD --; then
    echo -e "${GREEN}✓ No new changes to commit${NC}"
else
    echo -e "${BLUE}Changes to commit:${NC}"
    git status --short
    echo ""

    # Use provided commit message or ask for one
    if [ -z "$1" ]; then
        read -p "Enter commit message: " COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Update deployment"
        fi
    else
        COMMIT_MSG="$*"
    fi

    git commit -m "$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
    echo -e "${GREEN}✓ Changes committed${NC}"
fi

echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push origin main
echo -e "${GREEN}✓ Pushed to GitHub${NC}\n"

# Step 2: Deploy to Digital Ocean
echo -e "${YELLOW}📦 Step 2: Deploying to Digital Ocean (${DROPLET_IP})...${NC}\n"

ssh ${DROPLET_USER}@${DROPLET_IP} << 'ENDSSH'
    set -e

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📥 Pulling latest code from GitHub..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cd ~/balispaguidw_react
    git pull origin main
    echo "✓ Code updated"
    echo ""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔧 Updating backend dependencies..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cd backend
    npm ci --omit=dev
    echo "✓ Backend dependencies updated"
    echo ""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 Restarting backend with PM2..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    pm2 restart bali-backend
    pm2 save
    echo "✓ Backend restarted"
    echo ""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🏗️  Building frontend..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cd ../frontend
    npm ci
    VITE_API_BASE=http://170.64.148.27 npm run build
    echo "✓ Frontend built"
    echo ""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Deploying frontend to web root..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    rsync -a --delete dist/ /var/www/balispaguide/
    echo "✓ Frontend deployed"
    echo ""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "♻️  Reloading Nginx..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    systemctl reload nginx
    echo "✓ Nginx reloaded"
    echo ""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 Running health checks..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Check backend
    echo "Backend API:"
    curl -s http://127.0.0.1:4000/api/filters | head -c 100
    echo ""
    echo ""

    # Check PM2 status
    echo "PM2 Status:"
    pm2 status
    echo ""

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ENDSSH

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🌐 Your application is live at:${NC}"
echo -e "   ${GREEN}http://${DROPLET_IP}${NC}"
echo ""
echo -e "${BLUE}📊 To view logs:${NC}"
echo -e "   ${YELLOW}ssh ${DROPLET_USER}@${DROPLET_IP} 'pm2 logs bali-backend'${NC}"
echo ""
echo -e "${BLUE}📈 To check status:${NC}"
echo -e "   ${YELLOW}ssh ${DROPLET_USER}@${DROPLET_IP} 'pm2 status'${NC}"
echo ""
