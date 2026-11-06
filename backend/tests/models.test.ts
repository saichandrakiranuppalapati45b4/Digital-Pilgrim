import { describe, it, expect } from 'vitest';
import { User } from '../src/models/User';
import { Heritage } from '../src/models/Heritage';
import { Event } from '../src/models/Event';
import { Announcement } from '../src/models/Announcement';
import { Facility } from '../src/models/Facility';

describe('Mongoose Models & Schema Validation Audit', () => {
  it('User model requires valid email and passwordHash', async () => {
    const invalidUser = new User({ name: 'Test' });
    let err: any;
    try {
      await invalidUser.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.passwordHash).toBeDefined();
  });

  it('Heritage model requires bilingual fields, category and coordinates', async () => {
    const invalidHeritage = new Heritage({
      name: { en: 'Incomplete' },
    });
    let err: any;
    try {
      await invalidHeritage.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors['name.te']).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.address).toBeDefined();
  });

  it('Heritage model saves valid bilingual coordinates and category', async () => {
    const validHeritage = await Heritage.create({
      name: { en: 'Model Test Temple', te: 'పరీక్షా దేవాలయం' },
      slug: 'model-test-temple',
      category: 'temple',
      description: { en: 'English desc for test', te: 'తెలుగు వివరణ' },
      history: { en: 'English history for test', te: 'తెలుగు చరిత్ర' },
      significance: { en: 'English significance', te: 'తెలుగు ప్రాముఖ్యత' },
      address: 'Temple St, Rajahmundry',
      location: { latitude: 17.001, longitude: 81.778 },
      status: 'published',
    });
    expect(validHeritage._id).toBeDefined();
    expect(validHeritage.slug).toBe('model-test-temple');
  });

  it('Facility model validates facility type enum', async () => {
    const invalidFacility = new Facility({
      name: { en: 'Invalid Facility', te: 'చెల్లని సౌకర్యం' },
      type: 'invalid_type_not_allowed' as any,
      address: 'Main Street',
      location: { latitude: 17.0, longitude: 81.7 },
    });
    let err: any;
    try {
      await invalidFacility.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.type).toBeDefined();
  });
});
