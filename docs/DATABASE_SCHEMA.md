# Digital Pilgrim 1.0 — Database Schema Reference

**Database Engine:** MongoDB Atlas / MongoDB Community 6.0+  
**ODM:** Mongoose 8.9+  
**Namespace:** `digital_pilgrim`  

---

## 1. Collection: `users`
Stores administrative and editorial credentials with role-based access control.

```typescript
{
  _id: ObjectId,
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. Collection: `heritages`
Core repository of cultural destinations, holy ghats, and sacred temples.

```typescript
{
  _id: ObjectId,
  name: {
    en: { type: String, required: true, trim: true },
    te: { type: String, required: true, trim: true }
  },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  category: {
    type: String,
    enum: ['temple', 'ghat', 'historical_monument', 'spiritual_site', 'nature_cultural'],
    required: true,
    index: true
  },
  description: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  history: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  significance: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  address: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String },
      caption: {
        en: { type: String, default: '' },
        te: { type: String, default: '' }
      },
      isPrimary: { type: Boolean, default: false }
    }
  ],
  audioGuides: [
    {
      url: { type: String, required: true },
      publicId: { type: String },
      title: {
        en: { type: String, required: true },
        te: { type: String, default: '' }
      },
      language: { type: String, enum: ['en', 'te', 'both'], default: 'en' },
      duration: { type: Number, default: 0 }
    }
  ],
  qrCode: { type: String },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  isFeatured: { type: Boolean, default: false, index: true },
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:**
- Compound text index on: `{'name.en': 'text', 'name.te': 'text', 'description.en': 'text', 'description.te': 'text'}`
- Unique index on `slug`
- Index on `category`, `status`, and `isFeatured`

---

## 3. Collection: `events`
Ritual timings, cultural exhibitions, and Pushkaralu ceremonies.

```typescript
{
  _id: ObjectId,
  title: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  venue: { type: String, required: true },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true },
  location: {
    address: { type: String, default: '' },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  imageUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
    index: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. Collection: `announcements`
Critical public safety bulletins, advisory alerts, and ghat instructions.

```typescript
{
  _id: ObjectId,
  title: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  content: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  type: {
    type: String,
    enum: ['general', 'alert', 'pushkaralu', 'schedule', 'emergency'],
    default: 'general',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true
  },
  publishedAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date },
  isPublished: { type: Boolean, default: true, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. Collection: `facilities`
Essential pilgrim amenities across the Godavari region.

```typescript
{
  _id: ObjectId,
  name: {
    en: { type: String, required: true },
    te: { type: String, required: true }
  },
  type: {
    type: String,
    enum: [
      'drinking_water',
      'restroom',
      'hospital',
      'first_aid',
      'ghat',
      'parking',
      'food_prasadam',
      'accommodation',
      'information_center',
      'police_assistance'
    ],
    required: true,
    index: true
  },
  description: {
    en: { type: String, default: '' },
    te: { type: String, default: '' }
  },
  address: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  phone: { type: String, default: '' },
  operatingHours: { type: String, default: '24 Hours' },
  isVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true, index: true },
  createdAt: Date,
  updatedAt: Date
}
```
