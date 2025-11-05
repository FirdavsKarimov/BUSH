# 🚀 Quick Start Guide

Get the Korzinka Eco app up and running in minutes!

## 📋 What You Need

- Node.js 16+ installed
- Docker (optional, for containerized deployment)
- Code editor (VS Code recommended)

---

## ⚡ Fastest Way to Run

### Option 1: Local Development (Recommended for development)

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm run dev

# 3. Open in browser
# http://localhost:3221
```

That's it! The app is now running. 🎉

### Option 2: Docker (Recommended for production)

```bash
# 1. Start with Docker
npm run docker:up

# 2. Open in browser
# http://localhost:8080
```

Done! The containerized app is running. 🐳

---

## 🔑 Access Information

All credentials and URLs are documented in `CREDENTIALS.md`:

### Key URLs
- **Frontend (Dev):** http://localhost:3221
- **Frontend (Docker):** http://localhost:8080
- **Backend API:** https://api.bush.uz
- **pgAdmin:** http://69.30.237.168:5050/

---

## 📱 Test the App

1. **Home Page** - View balance and transaction history
2. **Catalogue** - Browse sustainable products
3. **Locations** - Find collection points on the map
4. **Scanner** - Scan barcodes (or enter manually)

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Docker
npm run docker:up        # Start container
npm run docker:down      # Stop container
npm run docker:logs      # View logs

# Testing
node test-api.js         # Test API connection
```

---

## 🔧 Configuration

### Change API URL

Edit the API URL in `src/utils/api.ts`:

```typescript
const API_BASE_URL = 'https://api.bush.uz';
```

Or use environment variables (create `.env` file):

```bash
VITE_API_BASE_URL=https://api.bush.uz
```

---

## 📚 Full Documentation

- **[README.md](./README.md)** - Project overview and features
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[DOCKER.md](./DOCKER.md)** - Docker setup details
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference
- **[CREDENTIALS.md](./CREDENTIALS.md)** - All access credentials
- **[DATABASE.md](./DATABASE.md)** - Database configuration

---

## ❓ Troubleshooting

### Port already in use?

Change the port in `vite.config.ts`:

```typescript
server: {
  port: 3000, // Change this number
  host: 'localhost'
}
```

### Can't connect to API?

1. Check if backend is running at `https://api.bush.uz`
2. Check browser console for errors
3. Verify CORS settings on backend

### Docker issues?

```bash
# Stop all containers
docker-compose down

# Clear cache
docker system prune -a

# Rebuild
npm run docker:build
npm run docker:up
```

---

## 🎯 Next Steps

1. **Explore the code** - Check out `src/` directory
2. **Read the docs** - See full documentation above
3. **Make changes** - Start customizing!
4. **Deploy** - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 💡 Tips

- Use React DevTools browser extension for debugging
- Check `package.json` for all available scripts
- Enable hot reload by keeping `npm run dev` running
- Use Docker for consistent environments across team

---

## 🆘 Need Help?

- Check browser console for errors
- Review logs: `npm run docker:logs`
- See `CREDENTIALS.md` for access info
- Contact the development team

---

**Happy coding! 🚀**

