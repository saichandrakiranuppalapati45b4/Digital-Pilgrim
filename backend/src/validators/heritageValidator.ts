import { z } from 'zod';

export const createHeritageSchema = z.object({
  name: z.object({
    en: z.string().min(2, 'English name is required'),
    te: z.string().min(2, 'Telugu name is required'),
  }),
  slug: z.string().optional(),
  category: z.enum(['temple', 'ghat', 'historical_monument', 'spiritual_site', 'nature_cultural']),
  description: z.object({
    en: z.string().min(10, 'English description is required'),
    te: z.string().min(10, 'Telugu description is required'),
  }),
  history: z.object({
    en: z.string().min(10, 'English history is required'),
    te: z.string().min(10, 'Telugu history is required'),
  }),
  significance: z.object({
    en: z.string().min(10, 'English significance is required'),
    te: z.string().min(10, 'Telugu significance is required'),
  }),
  address: z.string().min(3, 'Address is required'),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        caption: z
          .object({
            en: z.string().default(''),
            te: z.string().default(''),
          })
          .optional(),
        isPrimary: z.boolean().default(false),
      })
    )
    .default([]),
  audioGuides: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        title: z.object({
          en: z.string(),
          te: z.string().default(''),
        }),
        language: z.enum(['en', 'te', 'both']).default('en'),
        duration: z.number().default(0),
      })
    )
    .default([]),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  isFeatured: z.boolean().default(false),
});

export const updateHeritageSchema = createHeritageSchema.partial();
