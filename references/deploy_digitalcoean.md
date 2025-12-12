# Deployment Guide - DigitalOcean

Two options:
- **App Platform** (fully managed) — simplest for long-term.
- **Droplet** (VM) — what we deployed: Node backend via pm2 + Nginx serving the built frontend and proxying `/api`.

## App Platform (recommended managed option)
1) Create an App → connect repo/branch.  
2) Add **Web Service** for `backend/`  
   - Runtime: Node 20.  
   - Build: `npm ci --omit=dev` (or `npm install --production`).  
   - Run: `npm start`  
   - HTTP port: `8080` (App Platform injects `PORT`).  
   - Env vars (runtime): `NODE_ENV=production`.
3) Add **Static Site** for `frontend/`  
   - Build: `npm install && npm run build`  
   - Output: `dist`  
   - Env var (build): `VITE_API_BASE=<API URL from step 2>`.
4) Deploy and smoke test: `curl <api-url>/api/filters`, then open the static site and check requests hit the API.  
5) Add custom domain(s) in App Platform; HTTPS is automatic.  
6) Auto-deploy on push; if the API URL changes, update `VITE_API_BASE` and redeploy.

### CLI spec (template)
`doctl apps create --spec digitalocean.app.yaml`
```yaml
name: bali-spa-guide
region: sfo
services:
  - name: api
    environment_slug: node-js
    instance_size_slug: basic-xxs
    instance_count: 1
    source_dir: backend
    run_command: "npm start"
    build_command: "npm ci --omit=dev"
    http_port: 8080
    envs:
      - key: NODE_ENV
        value: production
        scope: RUN_TIME
    github:
      repo: your-org-or-user/your-repo
      branch: main
      deploy_on_push: true
static_sites:
  - name: web
    source_dir: frontend
    build_command: "npm install && npm run build"
    output_dir: dist
    envs:
      - key: VITE_API_BASE
        value: "https://<api-app-url>"
        scope: BUILD
    github:
      repo: your-org-or-user/your-repo
      branch: main
      deploy_on_push: true
```

## Droplet deployment (what’s running now)
Droplet: Ubuntu with Node 20, pm2, Nginx. Live at `http://<your-droplet-ip>` with `/api` proxied to the backend.

### One-time setup
```bash
# SSH in
ssh root@<droplet-ip>

# Install Node 20 + pm2
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

# Clone repo
cd /root
git clone https://github.com/mohdazlanabas/balispaguidw_react.git

# Install deps
cd balispaguidw_react/backend && npm ci --omit=dev
cd ../frontend && npm ci
```

### Build + run
```bash
# Build frontend (point to your public backend URL/IP)
cd /root/balispaguidw_react/frontend
VITE_API_BASE=http://<droplet-ip> npm run build

# Sync static build to web root
rsync -a --delete dist/ /var/www/balispaguide/

# Start backend with pm2
cd /root/balispaguidw_react/backend
PORT=4000 NODE_ENV=production pm2 start server.js --name bali-backend --update-env
pm2 save
pm2 startup systemd -u root --hp /root
```

### Nginx site (already configured)
`/etc/nginx/sites-available/balispaguide`
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/balispaguide;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri /index.html;
    }
}
```
Enable + reload:
```bash
ln -sf /etc/nginx/sites-available/balispaguide /etc/nginx/sites-enabled/balispaguide
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### Smoke tests
- Backend direct: `curl http://127.0.0.1:4000/api/filters`
- Via Nginx: `curl http://127.0.0.1/api/filters`
- Frontend: open `http://<droplet-ip>`

### Updating deployment
```bash
ssh root@<droplet-ip>
cd /root/balispaguidw_react
git pull

# Backend deps/code change
cd backend && npm ci --omit=dev && pm2 restart bali-backend && pm2 save

# Frontend rebuild
cd ../frontend && npm ci && VITE_API_BASE=http://<droplet-ip> npm run build
rsync -a --delete dist/ /var/www/balispaguide/
systemctl reload nginx
```

### Optional HTTPS (Let’s Encrypt)
Once a domain points to the droplet, install certbot:
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d example.com -d www.example.com
```
This will add HTTPS server blocks and auto-renewal.
