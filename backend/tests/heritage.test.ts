import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';
import { User } from '../src/models/User';
import { Heritage } from '../src/models/Heritage';
import { signToken } from '../src/utils/jwt';

describe('Heritage API (/api/v1/heritage)', () => {
  let adminToken: string;

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Test#2026', salt);
    const admin = await User.create({
      name: 'Site Admin',
      email: 'admin@pilgrim.org',
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    adminToken = signToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: 'admin',
    });

    // Create 1 published and 1 draft heritage item
    await Heritage.create([
      {
        slug: 'kotilingala-temple',
        name: {
          en: 'Kotilingeswara Swamy Temple',
          te: 'కోటిలింగేశ్వర స్వామి దేవాలయం',
        },
        category: 'temple',
        description: {
          en: 'Historic temple on Godavari banks.',
          te: 'గోదావరి తీరంలో చారిత్రక దేవాలయం.',
        },
        history: {
          en: 'Ancient centuries-old pilgrimage destination.',
          te: 'శతాబ్దాల ప్రాచీన పుణ్యక్షేత్రం.',
        },
        significance: {
          en: 'Key bathing ghat during Godavari Pushkaralu.',
          te: 'గోదావరి పుష్కరాల ప్రధాన స్నానఘట్టం.',
        },
        address: 'Rajahmundry, AP',
        location: { latitude: 16.9942, longitude: 81.7725 },
        images: [{ url: 'https://images.unsplash.com/photo-temple', isPrimary: true }],
        audioGuides: [
          {
            url: 'https://actions.google.com/sounds/audio.ogg',
            title: { en: 'Temple Audio', te: 'ఆడియో' },
            language: 'en',
            duration: 120,
          },
        ],
        status: 'published',
        isFeatured: true,
      },
      {
        slug: 'secret-cave-shrine',
        name: {
          en: 'Secret Cave Shrine (Draft)',
          te: 'గుహాలయం (చిత్తుప్రతి)',
        },
        category: 'spiritual_site',
        description: {
          en: 'Unpublished draft shrine under verification.',
          te: 'పరిశీలనలో ఉన్న అప్రకటిత పుణ్యక్షేత్రం.',
        },
        history: {
          en: 'Draft history.',
          te: 'చిత్తు చరిత్ర.',
        },
        significance: {
          en: 'Draft significance.',
          te: 'చిత్తు ప్రాముఖ్యత.',
        },
        address: 'Agency Hills, AP',
        location: { latitude: 17.5, longitude: 81.9 },
        status: 'draft',
        isFeatured: false,
      },
    ]);
  });

  it('visitors should only see published heritage locations', async () => {
    const res = await request(app).get('/api/v1/heritage');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].slug).toBe('kotilingala-temple');
  });

  it('visitors should NOT be able to access draft heritage via getBySlug', async () => {
    const res = await request(app).get('/api/v1/heritage/secret-cave-shrine');
    expect(res.status).toBe(404);
  });

  it('admins can see draft locations when authenticated', async () => {
    const res = await request(app)
      .get('/api/v1/heritage?status=draft')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].slug).toBe('secret-cave-shrine');
  });

  it('allows authenticated admin to create a new heritage location', async () => {
    const newLocation = {
      name: {
        en: 'Draksharamam Temple',
        te: 'ద్రాక్షారామ భీమేశ్వర స్వామి',
      },
      category: 'spiritual_site',
      description: {
        en: 'Pancharama Kshetra Dakshina Kashi.',
        te: 'పంచారామ క్షేత్రం దక్షిణ కాశీ.',
      },
      history: {
        en: 'Eastern Chalukya built 10th century.',
        te: 'తూర్పు చాళుక్యుల కాలం నాటి దేవాలయం.',
      },
      significance: {
        en: 'Houses Manikyamba Shakti Peetham.',
        te: 'మాణిక్యాంబ అమ్మవారి అష్టాదశ శక్తిపీఠం.',
      },
      address: 'Draksharamam, Konaseema',
      location: { latitude: 16.7933, longitude: 82.0628 },
      status: 'published',
    };

    const res = await request(app)
      .post('/api/v1/heritage')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newLocation);

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('draksharamam-temple');
    expect(res.body.data.qrCode).toBeDefined();
  });

  it('unauthenticated users cannot create heritage locations', async () => {
    const res = await request(app)
      .post('/api/v1/heritage')
      .send({ name: { en: 'Unauthorized', te: 'అనధికార' } });
    expect(res.status).toBe(401);
  });
});
