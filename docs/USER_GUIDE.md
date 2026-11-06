# Digital Pilgrim 1.0 — User & Administrator Manual

**Platform Tagline:** Explore Heritage. Experience Culture. Discover the Godavari.  
**Languages Supported:** English (Default) & Telugu (తెలుగు)  

---

## 1. Visitor Guide

### Exploring Heritage Locations
1. **Browse Directory:** Click **Heritage** in the navigation bar or **Explore Heritage Sites** on the homepage.
2. **Filter by Category:** Click on filter chips:
   - *Temples (దేవాలయాలు)*: Historic Shaivite and Vaishnavite shrines.
   - *River Ghats (స్నాన ఘాట్లు)*: Bathing steps and riverfront promenades.
   - *Spiritual Sites (ఆధ్యాత్మిక క్షేత్రాలు)*: Pancharama and Shakthi Peethas.
   - *Historical Monuments (చారిత్రక కట్టడాలు)*: Ancient Chalukyan stone architecture.
   - *Nature & Culture (ప్రకృతి & సంస్కృతి)*: Godavari delta waterways and groves.
3. **Keyword Search:** Type keywords in English or Telugu into the search bar.
4. **Destination Details:** Click on any card to view:
   - Full bilingual overview, architecture, historical chronicles, and Puranic legends.
   - High-definition photo gallery.
   - Audio guide player.
   - Map location coordinates and navigation links.
   - Unique QR code.

### Switching Between English & Telugu
- Click the language selector at the top-right corner of the navigation bar:
  - **EN (English):** Renders all UI strings and default bilingual data in English.
  - **తె (తెలుగు):** Renders all content with Telugu Unicode typography.
- Your language preference is automatically remembered on your device for future visits.
- If a specific field lacks a Telugu translation, the platform displays the English equivalent automatically.

### Interactive Pilgrimage Map
- Click **Map** in the top navigation.
- The map automatically centers on the Godavari delta (Rajahmundry & surrounding heritage sites).
- **Icons:**
  - 🏛️ **Maroon & Gold Temple Pins:** Heritage locations and holy bathing ghats.
  - 📍 **Saffron Pins:** Essential pilgrim facilities (drinking water, restrooms, hospitals, parking).
- Click any marker to open a popup with a preview image, category badge, and direct link to the full destination page.

### Audio Guide Experience
- Navigate to **Audio Guides** from the top menu or on any destination detail page.
- Select your preferred track from the track list.
- Use the play/pause, scrub slider, restart, and volume controls to listen to the history and legends of the site.

### QR Code Discovery at Temples & Ghats
- When visiting in person, look for the official Digital Pilgrim bronze or wooden QR plaques installed at temple gates and ghat promenades.
- Open your smartphone camera and scan the QR code.
- Your browser will open the destination page (`/heritage/[slug]`) directly, giving you immediate access to verified facts and audio guides without needing to log in or install an app.

### Pilgrim Facilities Directory
- Click **Facilities** to find essential civic amenities:
  - Drinking water dispensaries (RO purified cooled taps).
  - Clean restrooms and bathing changing stalls.
  - Emergency aid posts and district hospitals.
  - Free Annapurna prasadam dining halls.
  - Vehicle parking grounds.

---

## 2. Administrator Guide

### Accessing the Admin Console
1. Navigate to `/admin/login` or click **Admin Portal** in the navigation bar.
2. Enter your administrator email and password (e.g., `admin@digitalpilgrim.org`).
3. Click **Sign In**.

### Managing Heritage Locations (`/admin/heritage`)
- **Add New Location:** Click **+ Add New Location**. Fill in:
  - English and Telugu titles, descriptions, history, and significance.
  - Category, address, and geographic coordinates (latitude & longitude).
  - Image URLs and streaming audio URLs.
  - Status: `Published`, `Draft`, or `Archived`.
- **Automatic QR Generation:** Saving a location automatically generates its permanent unique high-resolution QR code.
- **Edit / Delete:** Use the action icons on the right side of the table to modify details or remove an entry.

### Managing Cultural Events (`/admin/events`)
- Create and schedule Godavari Pushkaralu ceremonies, evening Godavari Harati schedules, and cultural exhibitions.
- Set start dates, end dates, venues, and status (`Upcoming`, `Ongoing`, `Completed`).

### Posting Public Announcements (`/admin/announcements`)
- Broadcast critical updates to visiting pilgrims.
- Select priority: `Low`, `Medium`, `High`, or `Critical`.
- Urgent alerts appear at the top of the homepage and in the visitor bulletin.

### Managing Pilgrim Facilities (`/admin/facilities`)
- Register new water booths, medical posts, parking grounds, and changing rooms.
- Toggle the **Verified** badge to reassure visiting pilgrims.
