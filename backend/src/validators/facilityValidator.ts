import { z } from 'zod';

export const createFacilitySchema = z.object({
  name: z.object({
    en: z.string().min(2, 'English name is required'),
    te: z.string().min(2, 'Telugu name is required'),
  }),
  type: z.enum([
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
  ]),
  description: z
    .object({
      en: z.string().default(''),
      te: z.string().default(''),
    })
    .default({ en: '', te: '' }),
  address: z.string().min(2, 'Address is required'),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  phone: z.string().optional().default(''),
  operatingHours: z.string().optional().default('24 Hours'),
  isVerified: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const updateFacilitySchema = createFacilitySchema.partial();
