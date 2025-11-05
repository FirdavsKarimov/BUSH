# Docker Setup Guide

This guide will help you build and run the Korzinka Eco frontend application using Docker.

## Prerequisites

- Docker installed on your system ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start the container:**
   ```bash
   npm run docker:up
   # or
   docker-compose up -d
   ```

2. **Access the application:**
   Open your browser and navigate to `http://localhost:8080`

3. **View logs:**
   ```bash
   npm run docker:logs
   # or
   docker-compose logs -f
   ```

4. **Stop the container:**
   ```bash
   npm run docker:down
   # or
   docker-compose down
   ```

### Using Docker CLI

1. **Build the Docker image:**
   ```bash
   npm run docker:build
   # or
   docker build -t korzinka-eco-frontend .
   ```

2. **Run the container:**
   ```bash
   npm run docker:run
   # or
   docker run -p 8080:80 korzinka-eco-frontend
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:8080`

## Docker Configuration

### Dockerfile

The `Dockerfile` uses a multi-stage build process:

- **Stage 1 (Builder):** Builds the React application using Node.js 18 Alpine
- **Stage 2 (Production):** Serves the static files using Nginx Alpine

This approach results in a lightweight production image (~25MB).

### Nginx Configuration

The `nginx.conf` file includes:
- Client-side routing support (SPA)
- Gzip compression
- Static asset caching
- Security headers
- HTTP/2 support

### Environment Variables

The application uses the following environment variables:

- `VITE_API_BASE_URL` - Backend API URL (default: `https://api.bush.uz`)
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

These are configured in `docker-compose.yml` and `Dockerfile` by default.

To override environment variables:

1. Edit `docker-compose.yml` environment section:
   ```yaml
   environment:
     - VITE_API_BASE_URL=https://your-api-url.com
   ```

2. Or create a `.env` file and update `docker-compose.yml`:
   ```yaml
   services:
     frontend:
       env_file:
         - .env
   ```

**Note:** The API URL is set at build time for Vite applications, so you need to rebuild the image after changing it.

## Customization

### Change Port

To change the port the application runs on, edit `docker-compose.yml`:

```yaml
ports:
  - "3000:80"  # Change 3000 to your desired port
```

### Production Optimization

For production deployments, consider:

1. **Use a specific Node version** instead of `latest`
2. **Add health checks** in docker-compose.yml:
   ```yaml
   healthcheck:
     test: ["CMD", "wget", "-q", "--spider", "http://localhost:80"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

3. **Add resource limits**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

## Troubleshooting

### Container won't start

Check the logs:
```bash
docker-compose logs
```

### Port already in use

Either stop the service using port 8080 or change the port in `docker-compose.yml`

### Build fails

Clear Docker cache and rebuild:
```bash
docker system prune -a
npm run docker:build
```

## Docker Commands Reference

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build the Docker image |
| `npm run docker:run` | Run the container |
| `npm run docker:up` | Start with docker-compose |
| `npm run docker:down` | Stop docker-compose |
| `npm run docker:logs` | View container logs |

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

