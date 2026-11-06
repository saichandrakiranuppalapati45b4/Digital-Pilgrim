# Digital Pilgrim 1.0 — Deployment & Production Guide

**Target Environment:** Free-Tier Hosting (Vercel Frontend + Render Backend + MongoDB Atlas + Cloudinary)  
**Node.js Runtime:** v20.x or v22.x LTS  

---

## 1. Prerequisites & Free-Tier Services

| Service | Role | Free Tier Capacity |
|---|---|---|
| **MongoDB Atlas** | Managed Database Cluster | M0 Sandbox (512 MB storage, shared RAM) |
| **Cloudinary** | Image & Audio Media Cloud | Free plan (25 GB managed bandwidth/storage) |
| **Render** | Express REST API Service | Free Web Service (0.1 CPU, 512 MB RAM, SSL) |
| **Vercel** | Next.js 14 Web Application | Hobby Plan (Serverless functions, Edge CDN) |

---

## 2. Environment Variables Matrix

### Backend Environment Variables (`backend/.env`)

```ini
# Application Ports & Environment
PORT=5000
NODE_ENV=production
API_PREFIX=/api/v1
FRONTEND_URL=https://digital-pilgrim.vercel.app

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/digital_pilgrim?retryWrites=true&w=majority

# JWT & Cookie Sessions (Min 32 characters random strings)
JWT_SECRET=production_super_secret_jwt_key_random_64_characters_minimum_here
JWT_EXPIRES_IN=7d
COOKIE_SECRET=production_random_cookie_secret_key_random_64_chars_here

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Initial Admin Script Seeding (Used by npm run create-admin)
INITIAL_ADMIN_NAME="Digital Pilgrim Administrator"
INITIAL_ADMIN_EMAIL=admin@digitalpilgrim.org
INITIAL_ADMIN_PASSWORD=SecurePilgrimAdminPassword#2026
```

### Frontend Environment Variables (`frontend/.env.production`)

```ini
NEXT_PUBLIC_API_URL=https://digital-pilgrim-api.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=https://digital-pilgrim.vercel.app
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

---

## 3. Database & Admin Setup (One-time)

1. **Deploy Atlas Cluster:** Create a free M0 cluster on MongoDB Atlas, whitelist IP `0.0.0.0/0` (for Render serverless IP ranges), and copy the SRV connection URI.
2. **Seed Initial Data:**
```bash
cd backend
npm run seed
```
3. **Provision Initial Admin:**
```bash
cd backend
npm run create-admin
```

---

## 4. Backend Deployment on Render

1. Connect your Git repository to **Render.com**.
2. Create a new **Web Service**.
3. Configure settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/server.js`
   - **Health Check Path:** `/api/v1/health`
4. Add the backend environment variables under the **Environment** tab.
5. Deploy and note the assigned HTTPS domain (e.g., `https://digital-pilgrim-api.onrender.com`).

---

## 5. Frontend Deployment on Vercel

1. Import your Git repository into **Vercel.com**.
2. Select the framework preset: **Next.js**.
3. Set the **Root Directory** to `frontend`.
4. Configure environment variable:
   - `NEXT_PUBLIC_API_URL`: `https://digital-pilgrim-api.onrender.com/api/v1`
   - `NEXT_PUBLIC_APP_URL`: `https://digital-pilgrim.vercel.app`
5. Click **Deploy**.
6. Verify deployment by opening `https://digital-pilgrim.vercel.app` and navigating to `/heritage`, `/map`, and `/admin/login`.
