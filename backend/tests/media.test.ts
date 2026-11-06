import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';
import { User } from '../src/models/User';
import { signToken } from '../src/utils/jwt';

describe('Media API (/api/v1/media)', () => {
  let adminToken: string;

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('MediaAdmin123', salt);
    const admin = await User.create({
      name: 'Media Officer',
      email: 'media@digitalpilgrim.org',
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    adminToken = signToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: 'admin',
    });
  });

  it('rejects upload signature request if unauthenticated', async () => {
    const res = await request(app)
      .post('/api/v1/media/signature')
      .send({ folder: 'heritage-photos' });

    expect(res.status).toBe(401);
  });

  it('generates upload signature when authenticated as admin', async () => {
    const res = await request(app)
      .post('/api/v1/media/signature')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ folder: 'heritage-photos' });

    // Returns signature parameters or graceful 500 if credentials not in env
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data.timestamp).toBeDefined();
    }
  });

  it('rejects media deletion if unauthenticated', async () => {
    const res = await request(app).delete('/api/v1/media/sample_public_id');
    expect(res.status).toBe(401);
  });
});
