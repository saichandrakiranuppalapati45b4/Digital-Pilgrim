import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.object({
    en: z.string().min(2, 'English title is required'),
    te: z.string().min(2, 'Telugu title is required'),
  }),
  description: z.object({
    en: z.string().min(10, 'English description is required'),
    te: z.string().min(10, 'Telugu description is required'),
  }),
  venue: z.string().min(2, 'Venue is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  location: z
    .object({
      address: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
});

export const updateEventSchema = createEventSchema.partial();
