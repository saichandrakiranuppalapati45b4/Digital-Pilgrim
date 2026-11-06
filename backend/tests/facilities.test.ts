import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { Facility } from '../src/models/Facility';

describe('Facility API (/api/v1/facilities)', () => {
  beforeEach(async () => {
    await Facility.create([
      {
        name: { en: 'Pushkar Water Point', te: 'పుష్కర తాగునీటి కేంద్రం' },
        type: 'drinking_water',
        address: 'Pushkar Ghat, Rajahmundry',
        location: { latitude: 17.0005, longitude: 81.7778 },
        isVerified: true,
        isActive: true,
      },
      {
        name: { en: 'Ghat Hospital Aid', te: 'వైద్య కేంద్రం' },
        type: 'hospital',
        address: 'Station Road, Rajahmundry',
        location: { latitude: 17.002, longitude: 81.779 },
        isVerified: true,
        isActive: true,
      },
    ]);
  });

  it('lists all active facilities', async () => {
    const res = await request(app).get('/api/v1/facilities');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('filters facilities by type', async () => {
    const res = await request(app).get('/api/v1/facilities?type=hospital');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].type).toBe('hospital');
  });
});
