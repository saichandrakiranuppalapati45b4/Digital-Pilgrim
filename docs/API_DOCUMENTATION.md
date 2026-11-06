# Digital Pilgrim 1.0 — REST API Documentation

**Base URL:** `/api/v1`  
**Authentication Scheme:** Bearer Token header or HttpOnly Cookie (`token`)  
**Standard Response Envelope:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 35,
    "totalPages": 3
  }
}
```

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates administrator/editor and sets secure HttpOnly cookie.
- **Rate Limit:** 20 requests per 15 minutes.
- **Request Body:**
```json
{
  "email": "admin@digitalpilgrim.org",
  "password": "PilgrimAdmin#2026"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "673238914...",
      "name": "Digital Pilgrim Administrator",
      "email": "admin@digitalpilgrim.org",
      "role": "admin"
    },
    "token": "eyJhbGciOi..."
  }
}
```

### `POST /auth/logout`
Clears session cookie.
- **Response (200 OK):** `{"success": true, "message": "Logged out successfully"}`

### `GET /auth/me`
Retrieves current authenticated user profile.
- **Headers:** `Cookie: token=...` or `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "673238914...",
    "name": "Digital Pilgrim Administrator",
    "email": "admin@digitalpilgrim.org",
    "role": "admin"
  }
}
```

---

## 2. Heritage Locations

### `GET /heritage`
Returns a paginated list of heritage locations.
- **Access:** Public (visitors only receive `status: 'published'`). Authenticated admins can query `?status=draft` or `?status=archived`.
- **Query Parameters:**
  - `search` (string): Searches bilingual names, descriptions, and addresses.
  - `category` (enum): `temple`, `ghat`, `spiritual_site`, `historical_monument`, `nature_cultural`.
  - `isFeatured` (boolean): `true` or `false`.
  - `page` (number, default: 1).
  - `limit` (number, default: 12).

### `GET /heritage/featured`
Returns up to 6 featured published heritage locations.

### `GET /heritage/:slug`
Retrieves full destination details by slug (e.g., `kotilingeswara-temple-ghat`).
- Automatically generates and returns dynamic QR code data URL.

### `POST /heritage`
Creates a new heritage location.
- **Access:** Protected (`admin`, `editor`).
- **Request Body:**
```json
{
  "name": {
    "en": "Sri Bhimeswara Swamy Temple",
    "te": "శ్రీ భీమేశ్వర స్వామి దేవాలయం"
  },
  "slug": "draksharamam-bhimeswara",
  "category": "spiritual_site",
  "description": {
    "en": "Dakshina Kashi and supreme Pancharama Kshetra.",
    "te": "దక్షిణ కాశీగా ప్రసిద్ధి చెందిన పంచారామ క్షేత్రం."
  },
  "history": {
    "en": "Built by Eastern Chalukya King Bhima I.",
    "te": "తూర్పు చాళుక్య రాజైన మొదటి భీముడు నిర్మించారు."
  },
  "significance": {
    "en": "Enshrines Manikyamba Maha Shakthi Peetha.",
    "te": "మాణిక్యాంబ అమ్మవారి అష్టాదశ శక్తిపీఠం."
  },
  "address": "Draksharamam, Konaseema District, AP",
  "location": {
    "latitude": 16.7933,
    "longitude": 82.0628
  },
  "status": "published",
  "isFeatured": true
}
```

### `PATCH /heritage/:id`
Updates an existing heritage location. Protected (`admin`, `editor`).

### `DELETE /heritage/:id`
Deletes an existing heritage location. Protected (`admin`, `editor`).

---

## 3. QR Code Service

### `GET /qr/:locationId`
Retrieves QR code resolution metadata for any heritage ID or slug.
- **Query Parameter:** `?format=png` to download PNG stream attachment; default returns JSON with `qrCodeDataUrl`.

---

## 4. Media Management (Cloudinary)

### `POST /media/signature`
Generates a signed cryptographic signature for direct browser uploads to Cloudinary.
- **Access:** Protected (`admin`, `editor`).
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "signature": "3f7b2...",
    "timestamp": 1730700000,
    "cloudName": "digital_pilgrim_demo",
    "apiKey": "123456789012345",
    "folder": "digital-pilgrim"
  }
}
```

### `DELETE /media/:publicId`
Destroys an uploaded media asset from Cloudinary. Protected (`admin`, `editor`).

---

## 5. Events, Announcements & Facilities

- `GET /events`, `POST /events`, `PATCH /events/:id`, `DELETE /events/:id`
- `GET /announcements`, `POST /announcements`, `PATCH /announcements/:id`, `DELETE /announcements/:id`
- `GET /facilities`, `GET /facilities/:id`, `POST /facilities`, `PATCH /facilities/:id`, `DELETE /facilities/:id`

---

## 6. Health & System Metrics

### `GET /health`
Returns operational uptime and MongoDB connection state.
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "service": "Digital Pilgrim API",
    "version": "1.0.0",
    "uptime": 2341.2,
    "database": {
      "status": "connected",
      "connected": true
    }
  }
}
```

### `GET /stats`
Returns live calculated database statistics for admin dashboard. Protected (`admin`, `editor`).
