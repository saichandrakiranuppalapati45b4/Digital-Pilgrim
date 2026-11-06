# Digital Pilgrim 1.0

> **Explore Heritage. Experience Culture. Discover the Godavari.**

Digital Pilgrim 1.0 is a full-stack cultural heritage and pilgrimage companion web application built for **Godavari Pushkaralu** and the sacred pilgrimage destinations of Andhra Pradesh. It combines Next.js 14 App Router, Node.js/Express REST API, MongoDB Atlas, Cloudinary media CDN, Leaflet/OpenStreetMap spatial mapping, dynamic QR codes, and streaming audio guides in **English and Telugu**.

---

## 🌟 Key Features (20 Approved Requirements)

### A. Visitor Experience (7 Requirements)
1. **Explore Godavari Pushkaralu (`/pushkaralu`):** Spiritual significance, 12-year celestial cycle, historical chronicles, bathing ghat details, and essential visitor safety guidelines.
2. **Discover Heritage Locations (`/heritage`, `/heritage/[slug]`):** Searchable directory, category filters (Temples, Ghats, Spiritual Sites, Monuments, Nature), rich photo galleries, and bilingual narratives.
3. **English & Telugu Language Switching:** Persistent language toggle (`localStorage`), English fallback for missing fields, and Noto Sans Telugu Unicode typography.
4. **Interactive Destination Map (`/map`):** Interactive Leaflet + OpenStreetMap with live MongoDB location markers, popup previews, and pilgrim facility overlays.
5. **QR-Based Discovery (`/scan/[slug]`):** Unique high-correction QR codes for every published location. Public access without login, with PNG download option.
6. **Audio Guides (`/audio-guides`):** In-browser playback with play/pause, seek scrubber, track selection, and error handling for Cloudinary-hosted audio.
7. **Announcements & Facilities (`/announcements`, `/facilities`):** Real-time safety advisories with priority badges, plus directory of verified RO water kiosks, restrooms, emergency hospitals, food prasadam, and parking.

### B. Administration (6 Requirements)
1. **Secure Administrator Login (`/admin/login`):** Encrypted passwords (`bcrypt`), HttpOnly cookie session strategy, role-based authorization (`admin`, `editor`).
2. **Heritage CRUD (`/admin/heritage`):** Full creation, update, publication status toggles (`published`, `draft`, `archived`), and geographic coordinate management.
3. **Media Uploads:** Cloudinary signed upload integration keeping credentials strictly on the backend.
4. **QR Code Generation:** Automatic high-resolution QR code generation and direct PNG download.
5. **Events & Announcements (`/admin/events`, `/admin/announcements`):** Create and schedule cultural ceremonies and public notices.
6. **Facility Directory Management (`/admin/facilities`):** Register and verify pilgrim civic amenities.
*Note: The admin dashboard computes real live metrics directly from the MongoDB database.*

### C. Technical Delivery (7 Requirements)
1. **Next.js & TypeScript Frontend:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide icons.
2. **Node.js & Express Backend:** TypeScript REST API under `/api/v1`, Helmet, CORS origin restriction, rate limiting.
3. **MongoDB Atlas Database:** Mongoose schemas, text search indexes, and soft/hard validation.
4. **Cloudinary Media Storage:** Direct browser signed uploads for photos and streaming audio guides.
5. **Complete Documentation:** Full guides in `docs/`.
6. **Automated Testing:** 14 Vitest & Supertest unit and integration tests passing with 100% success.
7. **Production Deployment Ready:** Pre-configured for Vercel (Frontend) and Render (Backend).

---

## 🎨 Traditional Indian Heritage Design System

- **Primary Maroon:** `#7B263A` (Sacred temple red)
- **Saffron:** `#D97724` (Auspicious celebration)
- **Heritage Gold:** `#C49A45` (Ornamental metalwork)
- **Ivory Background:** `#FAF7F0` (Sanctum stone)
- **Charcoal Text:** `#302A27`
- **Secondary Text:** `#766B60`
- **Border Accent:** `#E9DFD0`
- **Typography:** Noto Serif (Headings), Inter (English Body), Noto Sans Telugu (Telugu Script).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v20+ or v22+ LTS)
- npm (v10+)
- MongoDB (Local instance or MongoDB Atlas free-tier URI)

### 2. Clone and Install Dependencies
```bash
git clone <repository-url>
cd "DIGITAL PILGRIM"
npm install
```

### 3. Environment Setup
Copy the sample environment templates:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

### 4. Seed Demonstration Data & Create Initial Admin
```bash
# Seed realistic Godavari heritage locations, events, and facilities
npm run seed

# Create initial admin account reading credentials from .env
npm run create-admin
```
*Default admin credentials in `.env.example`: `admin@digitalpilgrim.org` / `PilgrimAdmin#2026`.*

### 5. Start Development Servers
Run both applications concurrently:
```bash
# Start backend on :5000 and frontend on :3000
npm run dev
```
Or start individually:
```bash
npm run dev:backend   # API at http://localhost:5000/api/v1
npm run dev:frontend  # Web App at http://localhost:3000
```

---

## 🧪 Automated Testing & Production Builds

### Run Backend Unit & Integration Tests (14 Tests)
```bash
npm run test:backend
```

### Run Production Builds
```bash
# Compile backend TypeScript
npm run build:backend

# Generate optimized Next.js 14 production bundle
npm run build:frontend
```

---

## 📚 Complete Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): Full architectural overview, data flows, and security design.
- [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md): Complete REST API endpoints, request/response samples, and error codes.
- [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md): Mongoose schemas, data types, indexes, and relations.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): Step-by-step free-tier deployment on Vercel, Render, and MongoDB Atlas.
- [docs/USER_GUIDE.md](docs/USER_GUIDE.md): End-user and administrator manual with screenshots walkthrough.
- [docs/IMPLEMENTATION_PROGRESS.md](docs/IMPLEMENTATION_PROGRESS.md): Verified requirement-by-requirement checklist.

---

## ⚖️ Project License & Disclaimer

Built as a cultural and technical demonstration for hackathons and public showcase. Demonstrates real-world civic and pilgrimage digital infrastructure for Andhra Pradesh and Godavari Pushkaralu.
