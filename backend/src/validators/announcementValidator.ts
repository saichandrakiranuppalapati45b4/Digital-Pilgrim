import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.object({
    en: z.string().min(2, 'English title is required'),
    te: z.string().min(2, 'Telugu title is required'),
  }),
  content: z.object({
    en: z.string().min(5, 'English content is required'),
    te: z.string().min(5, 'Telugu content is required'),
  }),
  type: z.enum(['general', 'alert', 'pushkaralu', 'schedule', 'emergency']).default('general'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  publishedAt: z.string().or(z.date()).optional(),
  expiresAt: z.string().or(z.date()).optional().nullable(),
  isPublished: z.boolean().default(true),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();
