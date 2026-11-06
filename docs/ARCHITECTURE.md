# Digital Pilgrim 1.0 — Architecture & System Design

**Tagline:** Explore Heritage. Experience Culture. Discover the Godavari.  
**Platform Version:** 1.0.0 (MVP)  
**Deployment Profile:** Next.js (Vercel) + Node.js/Express (Render) + MongoDB Atlas + Cloudinary  

---

## 1. Executive Architecture Summary

Digital Pilgrim 1.0 is engineered as a clean decoupled monorepo structured into a modern Next.js 14 App Router frontend and a resilient Node.js / Express.js RESTful API service. The platform is architected around 20 core requirements designed for public pilgrimage exploration, offline-to-online QR code physical engagement, real-time spatial mapping with Leaflet/OpenStreetMap, Cloudinary media streaming, and secure administrative content management.

```
+-------------------------------------------------------------------------------+
|                             CLIENT VISITOR LAYER                              |
|   Next.js 14 App Router (React, TypeScript, Tailwind CSS, Lucide Icons)       |
|   - Bilingual Engine (English & Telugu with localStorage persistence)         |
|   - Leaflet & OpenStreetMap dynamic spatial interactive canvas                |
|   - HTML5 streaming audio guide player (Cloudinary backed)                    |
|   - QR code scanner landing routes (/scan/[slug]) & generator modal           |
+---------------------------------------+---------------------------------------+
                                        | HTTP / REST (Credentials included)
                                        v
+-------------------------------------------------------------------------------+
|                           BACKEND REST API SERVICE                            |
|   Express.js + TypeScript Runtime (Port 5000 / Prefix: /api/v1)              |
|   - Security: Helmet, CORS origin restriction, rate-limiters (IP & Auth)       |
|   - Authentication: HttpOnly JWT cookie session, bcrypt password hashing      |
|   - Validation: Strict Zod request schemas on all mutations                   |
|   - Error Handling: Centralized middleware transforming Zod/Mongoose errors   |
|   - QR Generator: Server-side high-error-correction PNG/DataURL stream        |
+-------------------+-----------------------------------+-----------------------+
                    |                                   |
                    v                                   v
+-------------------------------+   +-------------------------------------------+
|      MONGODB ATLAS / MONGODB   |   |           CLOUDINARY MEDIA CLOUD          |
|   - Users (Admins & Editors)   |   |   - Authenticated Signed Uploads          |
|   - Heritage Locations         |   |   - High-fidelity Photography CDN         |
|   - Cultural Events            |   |   - Low-latency Audio Stream Deliveries   |
|   - Public Announcements       |   +-------------------------------------------+
|   - Pilgrim Facilities         |
+-------------------------------+
```

---

## 2. Monorepo Organization

```
digital-pilgrim/
├── frontend/                     # Next.js 14 App Router Frontend
│   ├── src/
│   │   ├── app/                  # Public & Admin Page Routes
│   │   │   ├── page.tsx          # Homepage with Pushkaralu highlight
│   │   │   ├── pushkaralu/       # Pushkaralu deep dive & ghat guidelines
│   │   │   ├── heritage/         # Directory & [slug] detail pages
│   │   │   ├── map/              # Leaflet spatial map with markers
│   │   │   ├── scan/[slug]/      # QR scan landing route
│   │   │   ├── audio-guides/     # Dedicated audio guide player & tracks
│   │   │   ├── announcements/    # Public alerts & bulletins
│   │   │   ├── facilities/       # Drinking water, restrooms, hospitals
│   │   │   └── admin/            # Protected admin portal & CRUD modules
│   │   ├── components/           # Reusable UI & Layout Components
│   │   ├── hooks/                # useLanguage, useAuth
│   │   ├── lib/                  # REST API client & helpers
│   │   ├── locales/              # en.json & te.json Unicode dictionaries
│   │   ├── styles/               # globals.css with traditional Indian palette
│   │   └── types/                # TypeScript interface contracts
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── backend/                      # Node.js + Express + Mongoose Backend
│   ├── src/
│   │   ├── config/               # Database, Cloudinary & Env configuration
│   │   ├── controllers/          # Business logic handlers
│   │   ├── middleware/           # Auth, error handling & rate limiters
│   │   ├── models/               # Mongoose schemas & indexes
│   │   ├── routes/               # Modular Express routers
│   │   ├── services/             # QR code generation & Cloudinary signing
│   │   ├── utils/                # API responses, JWT, slugification
│   │   ├── validators/           # Zod schema definitions
│   │   ├── app.ts                # Express app setup
│   │   └── server.ts             # Server entry point
│   ├── scripts/                  # createAdmin.ts & seedData.ts
│   ├── tests/                    # Vitest + Supertest automated suite
│   ├── package.json
│   └── tsconfig.json
├── docs/                         # Architecture, API, Schema & Deployment Guides
├── package.json                  # Root npm workspace
└── README.md
```

---

## 3. Bilingualism & Typography

1. **Persistent Localized Context:** Managed by `LanguageProvider` with automatic browser persistence in `localStorage` (`dp_lang_pref`).
2. **Graceful English Fallback:** If a Telugu description or translation string is missing, the localization utility seamlessly displays the English text.
3. **Typography Standard:**
   - **Headings:** Noto Serif (`font-serif`)
   - **English Body:** Inter (`font-sans`)
   - **Telugu Unicode:** Noto Sans Telugu (`font-telugu`), styled to avoid clipping diacritics.

---

## 4. Security & Authorization

1. **Password Hashing:** Passwords hashed with `bcryptjs` using a salt work factor of 10.
2. **Session Security:** JWT stored in secure `HttpOnly`, `SameSite=lax` cookies.
3. **CORS:** Restricted to verified frontend origins with `credentials: true`.
4. **Rate Limiting:** Auth endpoints throttled to 20 requests per 15 minutes to block brute-force attempts; general API throttled to 300 requests per 15 minutes.
5. **No Secret Leaks:** Cloudinary API secret resides strictly on the backend. Client uploads use signed signatures generated dynamically via `/api/v1/media/signature`.
