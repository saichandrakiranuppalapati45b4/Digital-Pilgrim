import mongoose, { Document, Schema } from 'mongoose';

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

export interface IFacility extends Document {
  name: {
    en: string;
    te: string;
  };
  type: FacilityType;
  description: {
    en: string;
    te: string;
  };
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  operatingHours?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema = new Schema<IFacility>(
  {
    name: {
      en: { type: String, required: true, trim: true },
      te: { type: String, required: true, trim: true },
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
        'police_assistance',
      ],
      required: true,
      index: true,
    },
    description: {
      en: { type: String, default: '' },
      te: { type: String, default: '' },
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    phone: {
      type: String,
      default: '',
    },
    operatingHours: {
      type: String,
      default: '24 Hours',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Facility = mongoose.model<IFacility>('Facility', FacilitySchema);
