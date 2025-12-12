# Deployment Guide - Google Cloud Platform

Complete guide for deploying the Bali Spa Directory application on Google Cloud Platform.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Backend Deployment (Cloud Run)](#backend-deployment-cloud-run)
- [Frontend Deployment (Cloud Storage + CDN)](#frontend-deployment-cloud-storage--cdn)
- [Environment Configuration](#environment-configuration)
- [Custom Domain Setup](#custom-domain-setup)
- [Future: Database Setup](#future-database-setup)
- [Monitoring and Logging](#monitoring-and-logging)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Prerequisites

### 1. Install Google Cloud SDK

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2. Login to Google Cloud

```bash
gcloud auth login
gcloud auth application-default login
```

### 3. Install Node.js Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Project Setup

### 1. Create New GCP Project

```bash
# Create project (replace PROJECT_ID with your unique ID)
export PROJECT_ID="bali-spa-guide"
export REGION="asia-southeast1"

gcloud projects create $PROJECT_ID --name="Bali Spa Guide"

# Set as active project
gcloud config set project $PROJECT_ID

# Link billing account (required for Cloud Run)
# List billing accounts
gcloud billing accounts list

# Link billing (replace BILLING_ACCOUNT_ID)
gcloud billing projects link $PROJECT_ID \
  --billing-account=BILLING_ACCOUNT_ID
```

### 2. Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  storage.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  cloudscheduler.googleapis.com
```

### 3. Set Default Region

```bash
gcloud config set run/region $REGION
gcloud config set compute/region $REGION
```

---

## Backend Deployment (Cloud Run)

### 1. Create Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/filters', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
```

### 2. Create .dockerignore

Create `backend/.dockerignore`:

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.DS_Store
```

### 3. Deploy to Cloud Run

```bash
cd backend

# Build and deploy in one command
gcloud run deploy bali-spa-backend \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60s \
  --set-env-vars "NODE_ENV=production,PORT=4000"

# Get the backend URL
export BACKEND_URL=$(gcloud run services describe bali-spa-backend \
  --region $REGION \
  --format 'value(status.url)')

echo "Backend deployed at: $BACKEND_URL"
```

### 4. Test Backend

```bash
# Test the API
curl $BACKEND_URL/api/filters
curl "$BACKEND_URL/api/spas?page=1&pageSize=5"
```

---

## Frontend Deployment (Cloud Storage + CDN)

### 1. Create Production Environment File

Create `frontend/.env.production`:

```env
VITE_API_BASE=YOUR_BACKEND_URL_HERE
```

Replace `YOUR_BACKEND_URL_HERE` with the URL from the backend deployment.

### 2. Build Production Frontend

```bash
cd frontend

# Install dependencies if not already done
npm install

# Build for production
npm run build

# Verify build
ls -la dist/
```

### 3. Create Storage Bucket

```bash
# Create unique bucket name (must be globally unique)
export BUCKET_NAME="${PROJECT_ID}-frontend"

# Create bucket
gsutil mb -l $REGION gs://$BUCKET_NAME

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Enable website configuration
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME

# Enable CORS
cat > cors.json << 'EOF'
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors.json gs://$BUCKET_NAME
rm cors.json
```

### 4. Upload Frontend Files

```bash
# Upload all files from dist folder
gsutil -m rsync -r -d dist gs://$BUCKET_NAME

# Set cache control for assets
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" \
  gs://$BUCKET_NAME/assets/**

gsutil -m setmeta -h "Cache-Control:public, max-age=3600" \
  gs://$BUCKET_NAME/index.html
```

### 5. Setup Load Balancer with CDN (Optional but Recommended)

```bash
# Reserve static IP
gcloud compute addresses create bali-spa-frontend-ip \
  --global

# Create backend bucket
gcloud compute backend-buckets create bali-spa-backend-bucket \
  --gcs-bucket-name=$BUCKET_NAME \
  --enable-cdn

# Create URL map
gcloud compute url-maps create bali-spa-url-map \
  --default-backend-bucket=bali-spa-backend-bucket

# Create HTTP proxy
gcloud compute target-http-proxies create bali-spa-http-proxy \
  --url-map=bali-spa-url-map

# Create forwarding rule
gcloud compute forwarding-rules create bali-spa-http-rule \
  --global \
  --target-http-proxy=bali-spa-http-proxy \
  --address=bali-spa-frontend-ip \
  --ports=80

# Get the IP address
gcloud compute addresses describe bali-spa-frontend-ip --global
```

### 6. Test Frontend

```bash
# Get bucket URL
echo "Frontend URL: https://storage.googleapis.com/$BUCKET_NAME/index.html"

# Or if using Load Balancer
export FRONTEND_IP=$(gcloud compute addresses describe bali-spa-frontend-ip --global --format='value(address)')
echo "Frontend IP: http://$FRONTEND_IP"
```

---

## Environment Configuration

### 1. Backend Environment Variables

```bash
# Set environment variables for Cloud Run
gcloud run services update bali-spa-backend \
  --region $REGION \
  --set-env-vars "NODE_ENV=production,PORT=4000"
```

### 2. Using Secret Manager (for sensitive data)

```bash
# Create secret for future Stripe key
echo "your-stripe-secret-key" | \
  gcloud secrets create stripe-secret-key --data-file=-

# Grant Cloud Run access to secret
gcloud secrets add-iam-policy-binding stripe-secret-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Update Cloud Run to use secret
gcloud run services update bali-spa-backend \
  --region $REGION \
  --update-secrets=STRIPE_SECRET_KEY=stripe-secret-key:latest
```

---

## Custom Domain Setup

### 1. Setup Custom Domain for Backend

```bash
# Map custom domain to Cloud Run
gcloud run domain-mappings create \
  --service bali-spa-backend \
  --region $REGION \
  --domain api.yourdomain.com
```

### 2. Setup Custom Domain for Frontend

```bash
# Create managed SSL certificate
gcloud compute ssl-certificates create bali-spa-ssl-cert \
  --domains=www.yourdomain.com,yourdomain.com \
  --global

# Create HTTPS proxy
gcloud compute target-https-proxies create bali-spa-https-proxy \
  --url-map=bali-spa-url-map \
  --ssl-certificates=bali-spa-ssl-cert

# Create HTTPS forwarding rule
gcloud compute forwarding-rules create bali-spa-https-rule \
  --global \
  --target-https-proxy=bali-spa-https-proxy \
  --address=bali-spa-frontend-ip \
  --ports=443
```

### 3. DNS Configuration

Add these DNS records to your domain:

```
Type  Name              Value
A     @                 [FRONTEND_IP]
A     www               [FRONTEND_IP]
A     api               [BACKEND_IP or CNAME to Cloud Run URL]
```

---

## Future: Database Setup

### 1. Create Cloud SQL Instance (when ready for user accounts)

```bash
# Create PostgreSQL instance
gcloud sql instances create bali-spa-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION \
  --root-password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create balispaguide \
  --instance=bali-spa-db

# Create user
gcloud sql users create appuser \
  --instance=bali-spa-db \
  --password=YOUR_SECURE_PASSWORD
```

### 2. Connect Cloud Run to Cloud SQL

```bash
# Get connection name
export CONNECTION_NAME=$(gcloud sql instances describe bali-spa-db \
  --format='value(connectionName)')

# Update Cloud Run to connect to database
gcloud run services update bali-spa-backend \
  --region $REGION \
  --add-cloudsql-instances $CONNECTION_NAME \
  --set-env-vars "DATABASE_URL=postgresql://appuser:password@/balispaguide?host=/cloudsql/$CONNECTION_NAME"
```

---

## Monitoring and Logging

### 1. View Logs

```bash
# Backend logs
gcloud run services logs read bali-spa-backend \
  --region $REGION \
  --limit 50

# Tail logs
gcloud run services logs tail bali-spa-backend \
  --region $REGION
```

### 2. View Metrics

```bash
# Open Cloud Console
gcloud console
```

Navigate to: Cloud Run → bali-spa-backend → Metrics

### 3. Setup Alerts (Optional)

```bash
# Create alert for high error rate
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=5 \
  --condition-threshold-duration=300s
```

---

## CI/CD Pipeline

### 1. Create cloudbuild.yaml

Create `cloudbuild.yaml` in project root:

```yaml
steps:
  # Build Backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/bali-spa-backend', './backend']

  # Push Backend Image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/bali-spa-backend']

  # Deploy Backend to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'bali-spa-backend'
      - '--image=gcr.io/$PROJECT_ID/bali-spa-backend'
      - '--region=asia-southeast1'
      - '--platform=managed'

  # Build Frontend
  - name: 'node:18'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        cd frontend
        npm install
        npm run build

  # Deploy Frontend to Cloud Storage
  - name: 'gcr.io/cloud-builders/gsutil'
    args: ['-m', 'rsync', '-r', '-d', 'frontend/dist', 'gs://$PROJECT_ID-frontend']

images:
  - 'gcr.io/$PROJECT_ID/bali-spa-backend'

timeout: 1200s
```

### 2. Setup Cloud Build Trigger

```bash
# Connect to GitHub repository (do this in Cloud Console first)

# Create trigger
gcloud builds triggers create github \
  --repo-name=bali-spa-guide \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### 3. Deploy via Cloud Build

```bash
# Manual trigger
gcloud builds submit --config=cloudbuild.yaml

# Or push to main branch to trigger automatically
git push origin main
```

---

## Quick Update Scripts

### Update Backend Only

```bash
#!/bin/bash
# update-backend.sh
cd backend
gcloud run deploy bali-spa-backend \
  --source . \
  --region asia-southeast1
```

### Update Frontend Only

```bash
#!/bin/bash
# update-frontend.sh
cd frontend
npm run build
gsutil -m rsync -r -d dist gs://$PROJECT_ID-frontend
```

### Full Deployment

```bash
#!/bin/bash
# deploy-all.sh
set -e

echo "🚀 Deploying Bali Spa Guide..."

# Backend
echo "📦 Deploying backend..."
cd backend
gcloud run deploy bali-spa-backend --source . --region asia-southeast1

# Frontend
echo "🎨 Building and deploying frontend..."
cd ../frontend
npm run build
gsutil -m rsync -r -d dist gs://$PROJECT_ID-frontend

echo "✅ Deployment complete!"
echo "Backend: $(gcloud run services describe bali-spa-backend --region asia-southeast1 --format='value(status.url)')"
echo "Frontend: https://storage.googleapis.com/$PROJECT_ID-frontend/index.html"
```

Make scripts executable:
```bash
chmod +x update-backend.sh update-frontend.sh deploy-all.sh
```

---

## Cost Optimization Tips

1. **Cloud Run Auto-scaling**
   - Set min-instances to 0 for development
   - Increase for production to avoid cold starts

2. **CDN Caching**
   - Configure proper cache headers
   - Use CDN for static assets

3. **Cloud SQL**
   - Start with smallest instance (db-f1-micro)
   - Enable automatic backups only in production
   - Use connection pooling

4. **Budget Alerts**
   ```bash
   gcloud billing budgets create \
     --billing-account=BILLING_ACCOUNT_ID \
     --display-name="Bali Spa Guide Budget" \
     --budget-amount=50USD
   ```

---

## Troubleshooting

### Backend Issues

```bash
# Check logs
gcloud run services logs read bali-spa-backend --region asia-southeast1 --limit 100

# Check service details
gcloud run services describe bali-spa-backend --region asia-southeast1

# Test locally with Docker
cd backend
docker build -t bali-spa-backend .
docker run -p 4000:4000 bali-spa-backend
```

### Frontend Issues

```bash
# Verify bucket contents
gsutil ls -r gs://$PROJECT_ID-frontend

# Check bucket permissions
gsutil iam get gs://$PROJECT_ID-frontend

# Clear CDN cache
gcloud compute url-maps invalidate-cdn-cache bali-spa-url-map --path "/*"
```

### CORS Issues

Update backend `server.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://storage.googleapis.com'],
  credentials: true
}));
```

---

## Production Checklist

- [ ] Enable Cloud CDN
- [ ] Setup custom domain
- [ ] Configure SSL certificates
- [ ] Enable Cloud Armor (DDoS protection)
- [ ] Setup monitoring and alerts
- [ ] Configure budget alerts
- [ ] Enable Cloud Logging
- [ ] Setup automated backups
- [ ] Configure CI/CD pipeline
- [ ] Test disaster recovery
- [ ] Document API endpoints
- [ ] Setup staging environment

---

## Support and Resources

- **GCP Documentation**: https://cloud.google.com/docs
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Pricing Calculator**: https://cloud.google.com/products/calculator
- **Status Dashboard**: https://status.cloud.google.com

---

## Next Steps

1. Complete initial deployment
2. Test all functionality
3. Setup monitoring
4. Configure custom domain
5. Implement authentication
6. Integrate Stripe payments
7. Add Cloud SQL database
8. Setup CI/CD pipeline

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Version**: 1.0.0
