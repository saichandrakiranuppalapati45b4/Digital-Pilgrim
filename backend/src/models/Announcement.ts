import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAnnouncement extends Document {
  title: {
    en: string;
    te: string;
  };
  content: {
    en: string;
    te: string;
  };
  type: 'general' | 'alert' | 'pushkaralu' | 'schedule' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  publishedAt: Date;
  expiresAt?: Date;
  isPublished: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      en: { type: String, required: true, trim: true },
      te: { type: String, required: true, trim: true },
    },
    content: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    type: {
      type: String,
      enum: ['general', 'alert', 'pushkaralu', 'schedule', 'emergency'],
      default: 'general',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
