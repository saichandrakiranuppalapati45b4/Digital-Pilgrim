import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';
import { User } from '../src/models/User';
import { Announcement } from '../src/models/Announcement';
import { signToken } from '../src/utils/jwt';

describe('Announcements API (/api/v1/announcements)', () => {
  let adminToken: string;

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('AnnounceSecret123', salt);
    const admin = await User.create({
      name: 'Safety Admin',
      email: 'safety@digitalpilgrim.org',
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    adminToken = signToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: 'admin',
    });

    await Announcement.create([
      {
        title: {
          en: 'Bathing Safety: Use Barricaded Ghat Steps',
          te: 'స్నాన భద్రత: నిర్ణీత బారికేడ్ల లోపల మాత్రమే స్నానం ఆచరించండి',
        },
        content: {
          en: 'Pilgrims must adhere to river barricades and follow lifeguard directives.',
          te: 'యాత్రికులు గోదావరి బారికేడ్లను దాటవద్దు మరియు లైఫ్ గార్డుల సూచనలు పాటించండి.',
        },
        type: 'alert',
        priority: 'critical',
        publishedAt: new Date(),
        isPublished: true,
      },
      {
        title: {
          en: 'Internal Draft Notice',
          te: 'అంతర్గత చిత్తు సమాచారం',
        },
        content: {
          en: 'Under administrative review, not for public broadcast.',
          te: 'పరిశీలనలో ఉన్న సమాచారం, ప్రజలకు ప్రసారం చేయరాదు.',
        },
        type: 'general',
        priority: 'low',
        publishedAt: new Date(),
        isPublished: false,
      },
    ]);
  });

  it('unauthenticated visitors should only receive published announcements', async () => {
    const res = await request(app).get('/api/v1/announcements');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title.en).toBe('Bathing Safety: Use Barricaded Ghat Steps');
  });

  it('authenticated admin should see all announcements including drafts', async () => {
    const res = await request(app)
      .get('/api/v1/announcements')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('POST /api/v1/announcements creates a new notice when admin', async () => {
    const payload = {
      title: {
        en: 'Water Station Maintenance Notice',
        te: 'తాగునీటి కేంద్రాల నిర్వహణ గమనిక',
      },
      content: {
        en: 'Pushkar Ghat RO taps under routine sterilization between 2am and 4am.',
        te: 'పుష్కర ఘాట్ తాగునీటి కుళాయిల సాధారణ శుద్ధి కార్యక్రమం.',
      },
      type: 'general',
      priority: 'medium',
      isPublished: true,
    };

    const res = await request(app)
      .post('/api/v1/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.data.title.en).toBe('Water Station Maintenance Notice');
  });

  it('PATCH /api/v1/announcements/:id updates an announcement', async () => {
    const existing = await Announcement.findOne({ 'title.en': 'Bathing Safety: Use Barricaded Ghat Steps' });
    const res = await request(app)
      .patch(`/api/v1/announcements/${existing?._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ priority: 'high' });

    expect(res.status).toBe(200);
    expect(res.body.data.priority).toBe('high');
  });

  it('DELETE /api/v1/announcements/:id deletes notice', async () => {
    const existing = await Announcement.findOne({ 'title.en': 'Internal Draft Notice' });
    const res = await request(app)
      .delete(`/api/v1/announcements/${existing?._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const count = await Announcement.countDocuments({ 'title.en': 'Internal Draft Notice' });
    expect(count).toBe(0);
  });
});
