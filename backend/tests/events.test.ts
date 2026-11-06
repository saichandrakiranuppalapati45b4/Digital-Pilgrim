import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';
import { User } from '../src/models/User';
import { Event } from '../src/models/Event';
import { signToken } from '../src/utils/jwt';

describe('Events API (/api/v1/events)', () => {
  let adminToken: string;

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('AdminSecret123', salt);
    const admin = await User.create({
      name: 'Event Manager',
      email: 'events@digitalpilgrim.org',
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    adminToken = signToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: 'admin',
    });

    await Event.create([
      {
        title: {
          en: 'Godavari Harati Ceremony',
          te: 'గోదావరి నిత్య హారతి',
        },
        description: {
          en: 'Sacred evening lamp offering on Pushkar Ghat.',
          te: 'పుష్కర ఘాట్ వద్ద సాయంత్రం వేళ గోదావరి మాతకు సమర్పించే దివ్య హారతి.',
        },
        venue: 'Pushkar Ghat, Rajahmundry',
        startDate: new Date('2026-07-15T18:00:00Z'),
        endDate: new Date('2026-07-27T21:00:00Z'),
        location: {
          address: 'Pushkar Ghat, Rajahmundry',
          latitude: 17.0005,
          longitude: 81.7778,
        },
        status: 'ongoing',
      },
      {
        title: {
          en: 'Cultural Exhibition',
          te: 'సాంస్కృతిక ప్రదర్శన',
        },
        description: {
          en: 'Exhibition of classical Telugu art and music.',
          te: 'శాస్త్రీయ తెలుగు కళలు మరియు సంగీత ప్రదర్శన.',
        },
        venue: 'Anam Kala Kendram',
        startDate: new Date('2026-08-01T10:00:00Z'),
        endDate: new Date('2026-08-05T18:00:00Z'),
        status: 'upcoming',
      },
    ]);
  });

  it('GET /api/v1/events should return public list of events', async () => {
    const res = await request(app).get('/api/v1/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].title.en).toBe('Godavari Harati Ceremony');
  });

  it('GET /api/v1/events?status=upcoming should filter by status', async () => {
    const res = await request(app).get('/api/v1/events?status=upcoming');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title.en).toBe('Cultural Exhibition');
  });

  it('POST /api/v1/events should create new event when authenticated as admin', async () => {
    const newEvent = {
      title: {
        en: 'Pushkaralu Inaugural Procession',
        te: 'పుష్కర ప్రారంభ శోభాయాత్ర',
      },
      description: {
        en: 'Grand ceremonial procession through historic street.',
        te: 'చారిత్రక రాజవీధి గుండా ఘనమైన శోభాయాత్ర.',
      },
      venue: 'Main Road to Pushkar Ghat',
      startDate: new Date('2026-07-14T06:00:00Z').toISOString(),
      endDate: new Date('2026-07-14T12:00:00Z').toISOString(),
      status: 'upcoming',
    };

    const res = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newEvent);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title.en).toBe('Pushkaralu Inaugural Procession');
  });

  it('POST /api/v1/events should be rejected without authentication', async () => {
    const res = await request(app)
      .post('/api/v1/events')
      .send({
        title: { en: 'Unauthenticated Event', te: 'అనధికార ఉత్సవం' },
      });
    expect(res.status).toBe(401);
  });

  it('PATCH /api/v1/events/:id should update event', async () => {
    const existing = await Event.findOne({ 'title.en': 'Cultural Exhibition' });
    const res = await request(app)
      .patch(`/api/v1/events/${existing?._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ venue: 'Subramanya Grounds' });

    expect(res.status).toBe(200);
    expect(res.body.data.venue).toBe('Subramanya Grounds');
  });

  it('DELETE /api/v1/events/:id should remove event', async () => {
    const existing = await Event.findOne({ 'title.en': 'Cultural Exhibition' });
    const res = await request(app)
      .delete(`/api/v1/events/${existing?._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const count = await Event.countDocuments({ 'title.en': 'Cultural Exhibition' });
    expect(count).toBe(0);
  });
});
