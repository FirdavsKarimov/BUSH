# Deployment Guide

Complete guide for deploying the Korzinka Eco frontend application to various platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Local Deployment](#local-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Platforms](#cloud-platforms)
6. [Production Checklist](#production-checklist)

---

## Prerequisites

- Node.js 16+ and npm
- Docker and Docker Compose (for containerized deployment)
- Access to backend API: `https://api.bush.uz`
- Git for version control

---

## Environment Configuration

### 1. Frontend Environment Variables

The application uses these environment variables (configure via `.env` file):

```bash
VITE_API_BASE_URL=https://api.bush.uz
VITE_APP_NAME=Korzinka Eco App
VITE_APP_VERSION=1.0.0
```

**Note:** Vite requires `VITE_` prefix for environment variables to be exposed to the client.

### 2. Backend Configuration

Backend API is hosted at: `https://api.bush.uz`

Database connection details are in `DATABASE.md` and `CREDENTIALS.md`.

---

## Local Deployment

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at: http://localhost:3221
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# The build output is in ./dist directory
```

---

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start the container
npm run docker:up

# Or manually:
docker-compose up -d

# Access at: http://localhost:8080
```

### Manual Docker Build

```bash
# Build the image
docker build -t korzinka-eco-frontend .

# Run the container
docker run -p 8080:80 korzinka-eco-frontend

# Access at: http://localhost:8080
```

### Custom API URL in Docker

Edit `docker-compose.yml` to change the API URL:

```yaml
services:
  frontend:
    build:
      args:
        - VITE_API_BASE_URL=https://your-api-url.com
    environment:
      - VITE_API_BASE_URL=https://your-api-url.com
```

Then rebuild:
```bash
docker-compose build --no-cache
docker-compose up -d
```

---

## Cloud Platforms

### Netlify

1. **Connect Repository**
   - Sign in to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_API_BASE_URL` = `https://api.bush.uz`

4. **Deploy**
   - Netlify will auto-deploy on every push to main branch
   - The `_redirects` file is already configured for SPA routing

### Vercel

1. **Import Project**
   - Sign in to [Vercel](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your Git repository

2. **Configure Project**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**
   - Add environment variables:
     - `VITE_API_BASE_URL` = `https://api.bush.uz`

4. **Deploy**
   - Click "Deploy"
   - Auto-deploys on every push

### AWS S3 + CloudFront

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://korzinka-eco-frontend
   aws s3 sync dist/ s3://korzinka-eco-frontend
   ```

3. **Configure S3 for Static Website**
   - Enable static website hosting
   - Set index.html as index and error document

4. **Setup CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom error responses for SPA routing

### DigitalOcean App Platform

1. **Create New App**
   - Sign in to [DigitalOcean](https://digitalocean.com)
   - Create new app from GitHub repo

2. **Configure Build**
   ```
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Environment Variables**
   - Add: `VITE_API_BASE_URL=https://api.bush.uz`

4. **Deploy**

### Self-Hosted VPS (Ubuntu/Debian)

1. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd Bush2
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Setup Nginx Reverse Proxy** (optional)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Production Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Build succeeds without errors
- [ ] All tests pass
- [ ] Security vulnerabilities checked (`npm audit`)
- [ ] Dependencies updated
- [ ] `.gitignore` configured properly
- [ ] Sensitive files excluded from git

### Post-Deployment

- [ ] Application loads correctly
- [ ] API calls working
- [ ] Authentication functioning
- [ ] All pages accessible
- [ ] Scanner working (if applicable)
- [ ] Map displaying correctly
- [ ] Mobile responsiveness verified
- [ ] HTTPS enabled
- [ ] Error monitoring setup
- [ ] Performance metrics checked
- [ ] CORS configured on backend

### Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] API keys not exposed in frontend
- [ ] CORS properly configured on backend
- [ ] Rate limiting enabled on API
- [ ] Database credentials secure
- [ ] Regular security updates

### Monitoring

- [ ] Analytics setup (Google Analytics, etc.)
- [ ] Error tracking (Sentry, LogRocket, etc.)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Log aggregation

---

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        
    - name: Deploy
      # Add your deployment steps here
      # e.g., deploy to Netlify, Vercel, S3, etc.
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Docker Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### API Connection Issues

1. Check API URL in environment variables
2. Verify CORS settings on backend
3. Check network connectivity
4. Review browser console for errors

### Deployment Not Updating

1. Clear CDN cache (if using)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check if build deployed successfully
4. Verify environment variables are set

---

## Rollback Procedure

### Netlify/Vercel
- Use the platform's deployment history to rollback

### Docker
```bash
# Stop current container
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and deploy
docker-compose up -d --build
```

---

## Performance Optimization

1. **Enable Gzip/Brotli compression** (already configured in nginx)
2. **Use CDN** for static assets
3. **Optimize images** before deployment
4. **Code splitting** with React.lazy()
5. **Caching strategy** properly configured
6. **Monitor bundle size** with `npm run build`

---

## Support

For deployment issues:
- Check logs: `docker-compose logs -f` (for Docker)
- Review build logs in your deployment platform
- Check `CREDENTIALS.md` for access information
- Contact the development team

---

**Last Updated:** November 5, 2025

