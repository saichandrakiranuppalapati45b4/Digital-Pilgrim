import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { Heritage } from '../src/models/Heritage';

describe('QR API (/api/v1/qr)', () => {
  beforeEach(async () => {
    await Heritage.create({
      slug: 'pushkar-ghat',
      name: {
        en: 'Pushkar Ghat Rajahmundry',
        te: 'పుష్కర ఘాట్ రాజమండ్రి',
      },
      category: 'ghat',
      description: {
        en: 'Prime holy bathing steps along Godavari.',
        te: 'గోదావరి పవిత్ర స్నాన ఘట్టం.',
      },
      history: {
        en: 'Heritage riverfront.',
        te: 'చారిత్రక తీరం.',
      },
      significance: {
        en: 'Godavari Harati venue.',
        te: 'హారతి వేదిక.',
      },
      address: 'Main Ghat Road, Rajahmundry',
      location: { latitude: 17.0005, longitude: 81.7778 },
      status: 'published',
    });
  });

  it('should return QR metadata and data URL for valid location slug', async () => {
    const res = await request(app).get('/api/v1/qr/pushkar-ghat');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('pushkar-ghat');
    expect(res.body.data.qrCodeDataUrl).toMatch(/^data:image\/png;base64,/);
    expect(res.body.data.destinationUrl).toContain('/heritage/pushkar-ghat');
  });

  it('should return 404 for unknown location QR request', async () => {
    const res = await request(app).get('/api/v1/qr/non-existent-location');
    expect(res.status).toBe(404);
  });
});
