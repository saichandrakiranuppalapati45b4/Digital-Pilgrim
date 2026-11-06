import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: {
    en: string;
    te: string;
  };
  description: {
    en: string;
    te: string;
  };
  venue: string;
  startDate: Date;
  endDate: Date;
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      en: { type: String, required: true, trim: true },
      te: { type: String, required: true, trim: true },
    },
    description: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      address: { type: String, default: '' },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
