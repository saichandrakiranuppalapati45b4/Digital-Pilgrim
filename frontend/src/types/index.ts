export type Language = 'en' | 'te';

export interface BilingualText {
  en: string;
  te?: string;
}

export type HeritageCategory =
  | 'temple'
  | 'ghat'
  | 'historical_monument'
  | 'spiritual_site'
  | 'nature_cultural';

export interface HeritageImage {
  url: string;
  publicId?: string;
  caption?: {
    en: string;
    te?: string;
  };
  isPrimary?: boolean;
}

export interface HeritageAudio {
  url: string;
  publicId?: string;
  title: BilingualText;
  language: 'en' | 'te' | 'both';
  duration?: number;
}

export interface HeritageLocation {
  _id: string;
  name: BilingualText;
  slug: string;
  category: HeritageCategory;
  description: BilingualText;
  history: BilingualText;
  significance: BilingualText;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  images: HeritageImage[];
  audioGuides: HeritageAudio[];
  qrCode?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  _id: string;
  title: BilingualText;
  description: BilingualText;
  venue: string;
  startDate: string;
  endDate: string;
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export type AnnouncementType = 'general' | 'alert' | 'pushkaralu' | 'schedule' | 'emergency';
export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AnnouncementItem {
  _id: string;
  title: BilingualText;
  content: BilingualText;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  publishedAt: string;
  expiresAt?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FacilityType =
  | 'drinking_water'
  | 'restroom'
  | 'hospital'
  | 'first_aid'
  | 'ghat'
  | 'parking'
  | 'food_prasadam'
  | 'accommodation'
  | 'information_center'
  | 'police_assistance';

export interface FacilityItem {
  _id: string;
  name: BilingualText;
  type: FacilityType;
  description?: BilingualText;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  operatingHours?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

export interface DashboardStats {
  heritage: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    byCategory: Record<string, number>;
  };
  events: {
    total: number;
  };
  announcements: {
    total: number;
  };
  facilities: {
    total: number;
  };
  totalAudioGuides: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: any;
}
