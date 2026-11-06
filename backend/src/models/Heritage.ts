import mongoose, { Document, Schema } from 'mongoose';

export interface IHeritageImage {
  url: string;
  publicId?: string;
  caption?: {
    en: string;
    te?: string;
  };
  isPrimary?: boolean;
}

export interface IHeritageAudio {
  url: string;
  publicId?: string;
  title: {
    en: string;
    te?: string;
  };
  language: 'en' | 'te' | 'both';
  duration?: number; // seconds
}

export interface IHeritage extends Document {
  name: {
    en: string;
    te: string;
  };
  slug: string;
  category: 'temple' | 'ghat' | 'historical_monument' | 'spiritual_site' | 'nature_cultural';
  description: {
    en: string;
    te: string;
  };
  history: {
    en: string;
    te: string;
  };
  significance: {
    en: string;
    te: string;
  };
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  images: IHeritageImage[];
  audioGuides: IHeritageAudio[];
  qrCode?: string; // QR code data URL or hosted link
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeritageSchema = new Schema<IHeritage>(
  {
    name: {
      en: { type: String, required: true, trim: true },
      te: { type: String, required: true, trim: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['temple', 'ghat', 'historical_monument', 'spiritual_site', 'nature_cultural'],
      required: true,
      index: true,
    },
    description: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    history: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    significance: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        caption: {
          en: { type: String, default: '' },
          te: { type: String, default: '' },
        },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    audioGuides: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        title: {
          en: { type: String, required: true },
          te: { type: String, default: '' },
        },
        language: { type: String, enum: ['en', 'te', 'both'], default: 'en' },
        duration: { type: Number, default: 0 },
      },
    ],
    qrCode: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

HeritageSchema.index({ 'name.en': 'text', 'name.te': 'text', 'description.en': 'text', 'description.te': 'text' });

export const Heritage = mongoose.model<IHeritage>('Heritage', HeritageSchema);
