import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';
import { User } from '../src/models/User';
import { Heritage } from '../src/models/Heritage';
import { Event } from '../src/models/Event';
import { Announcement } from '../src/models/Announcement';
import { Facility } from '../src/models/Facility';

describe('Critical Pilgrimage & Administration End-to-End Workflows', () => {
  let adminToken: string;
  let adminCookie: string;

  beforeEach(async () => {
    // Setup test administrator
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('SecureWorkflow#2026', salt);
    await User.create({
      name: 'Workflow Admin',
      email: 'workflow.admin@digitalpilgrim.org',
      passwordHash,
      role: 'admin',
      isActive: true,
    });

    // Login as admin
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'workflow.admin@digitalpilgrim.org',
        password: 'SecureWorkflow#2026',
      });

    adminToken = loginRes.body.data.token;
    adminCookie = loginRes.headers['set-cookie'][0];
  });

  it('Workflow 1: Complete Visitor Journey (Search, Details, QR, Facilities, Audio)', async () => {
    // 1. Admin publishes a site
    const createRes = await request(app)
      .post('/api/v1/heritage')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: {
          en: 'Sri Ksheera Ramalingeswara Swamy Temple',
          te: 'శ్రీ క్షీర రామలింగేశ్వర స్వామి దేవాలయం',
        },
        slug: 'ksheera-ramalingeswara-palakollu',
        category: 'spiritual_site',
        description: {
          en: 'One of the five celestial Pancharama Kshetras in Godavari region.',
          te: 'గోదావరి తీరప్రాంతంలోని పంచారామ క్షేత్రాలలో ఒకటైన దివ్య క్షేత్రం.',
        },
        history: {
          en: 'Consecrated by Lord Vishnu according to regional sthala purana.',
          te: 'స్థల పురాణం ప్రకారం విష్ణుమూర్తిచే ప్రతిష్టించబడిన క్షేత్రం.',
        },
        significance: {
          en: 'Features a 9-storeyed white Rajagopuram and sacred milky lingam.',
          te: 'తొమ్మిది అంతస్తుల పాలరాతి రాజగోపురం మరియు అద్భుత లింగం.',
        },
        address: 'Palakollu, West Godavari District, AP',
        location: { latitude: 16.5167, longitude: 81.7333 },
        audioGuides: [
          {
            url: 'https://res.cloudinary.com/demo/audio/ksheerarama.mp3',
            title: { en: 'Legends of Ksheerarama', te: 'క్షీరారామ స్థలపురాణం' },
            language: 'both',
            duration: 195,
          },
        ],
        status: 'published',
        isFeatured: true,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.qrCode).toBeDefined();

    // 2. Visitor searches for temple in English
    const searchEn = await request(app).get('/api/v1/heritage?search=Ksheera');
    expect(searchEn.status).toBe(200);
    expect(searchEn.body.data.length).toBe(1);

    // 3. Visitor searches in Telugu Unicode
    const searchTe = await request(app).get(
      `/api/v1/heritage?search=${encodeURIComponent('రామలింగేశ్వర')}`
    );
    expect(searchTe.status).toBe(200);
    expect(searchTe.body.data.length).toBe(1);

    // 4. Visitor opens detail page by slug
    const detail = await request(app).get(
      '/api/v1/heritage/ksheera-ramalingeswara-palakollu'
    );
    expect(detail.status).toBe(200);
    expect(detail.body.data.name.en).toBe('Sri Ksheera Ramalingeswara Swamy Temple');
    expect(detail.body.data.audioGuides.length).toBe(1);

    // 5. Visitor resolves QR endpoint
    const qrRes = await request(app).get(
      '/api/v1/qr/ksheera-ramalingeswara-palakollu'
    );
    expect(qrRes.status).toBe(200);
    expect(qrRes.body.data.qrCodeDataUrl).toMatch(/^data:image\/png;base64,/);
    expect(qrRes.body.data.destinationUrl).toContain('/heritage/ksheera-ramalingeswara-palakollu');
  });

  it('Workflow 2: Admin Dashboard Real Statistics & Lifecycle', async () => {
    // 1. Initial dashboard stats
    const statsBefore = await request(app)
      .get('/api/v1/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(statsBefore.status).toBe(200);
    const initialHeritageCount = statsBefore.body.data.heritage.total;

    // 2. Admin creates a facility
    const facRes = await request(app)
      .post('/api/v1/facilities')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: {
          en: 'Kotilingala Emergency Medical Unit',
          te: 'కోటిలింగాల అత్యవసర వైద్య కేంద్రం',
        },
        type: 'hospital',
        address: 'Kotilingala Ghat Approach, Rajahmundry',
        location: { latitude: 16.9942, longitude: 81.7725 },
        phone: '108',
        operatingHours: '24 Hours',
        isVerified: true,
      });
    expect(facRes.status).toBe(201);

    // 3. Admin creates an announcement
    const annRes = await request(app)
      .post('/api/v1/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: { en: 'Pushkaralu Crowd Control', te: 'రద్దీ నియంత్రణ సూచన' },
        content: {
          en: 'Special one-way pedestrian routes active across Main Road ghat approaches.',
          te: 'ప్రధాన రహదారి ఘాట్ మార్గాలలో వన్-వే పాదచారుల నడకదారులు అమల్లో ఉన్నాయి.',
        },
        type: 'alert',
        priority: 'high',
        isPublished: true,
      });
    expect(annRes.status).toBe(201);

    // 4. Verify stats reflect live DB updates
    const statsAfter = await request(app)
      .get('/api/v1/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(statsAfter.body.data.facilities.total).toBeGreaterThanOrEqual(1);
    expect(statsAfter.body.data.announcements.total).toBeGreaterThanOrEqual(1);
  });

  it('Workflow 3: Security & RBAC Enforcement Audit', async () => {
    // 1. Unauthenticated mutation attempts
    const unauthPost = await request(app)
      .post('/api/v1/heritage')
      .send({ name: { en: 'Hack Attempt', te: 'హ్యాక్' } });
    expect(unauthPost.status).toBe(401);

    const unauthDelete = await request(app).delete(
      '/api/v1/heritage/673238914000000000000000'
    );
    expect(unauthDelete.status).toBe(401);

    const unauthStats = await request(app).get('/api/v1/stats');
    expect(unauthStats.status).toBe(401);

    // 2. Cookie authentication via HttpOnly header
    const cookieAuthRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', adminCookie);
    expect(cookieAuthRes.status).toBe(200);
    expect(cookieAuthRes.body.data.email).toBe('workflow.admin@digitalpilgrim.org');
    // Ensure password hash is NEVER leaked in /me
    expect(cookieAuthRes.body.data.passwordHash).toBeUndefined();
  });
});
