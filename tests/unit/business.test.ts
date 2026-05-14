import { describe, it, expect } from 'vitest';
import {
  BUSINESS_INFO,
  RATING_INFO,
  SHOP_PHONE_TEL,
  SHOP_PHONE_DISPLAY,
  getOpeningHoursSpecification,
  getGeoCoordinates,
  getPostalAddress,
  getAggregateRating,
} from '@/lib/business';

describe('BUSINESS_INFO constants', () => {
  it('should have a valid URL', () => {
    expect(BUSINESS_INFO.url).toMatch(/^https:\/\/.+/);
  });

  it('should have a valid phone number', () => {
    expect(BUSINESS_INFO.telephone).toMatch(/^\+1-\d{3}-\d{3}-\d{4}$/);
  });

  it('should have a complete address', () => {
    expect(BUSINESS_INFO.address.streetAddress).toBeTruthy();
    expect(BUSINESS_INFO.address.addressLocality).toBeTruthy();
    expect(BUSINESS_INFO.address.addressRegion).toMatch(/^[A-Z]{2}$/);
    expect(BUSINESS_INFO.address.postalCode).toMatch(/^\d{5}$/);
    expect(BUSINESS_INFO.address.addressCountry).toBe('US');
  });

  it('should have geo coordinates within US bounds', () => {
    expect(BUSINESS_INFO.geo.latitude).toBeGreaterThan(24);
    expect(BUSINESS_INFO.geo.latitude).toBeLessThan(50);
    expect(BUSINESS_INFO.geo.longitude).toBeGreaterThan(-125);
    expect(BUSINESS_INFO.geo.longitude).toBeLessThan(-66);
  });

  it('should have at least one service type', () => {
    expect(BUSINESS_INFO.serviceTypes.length).toBeGreaterThan(0);
  });
});

describe('Phone constants', () => {
  it('SHOP_PHONE_TEL should be E.164 format', () => {
    expect(SHOP_PHONE_TEL).toMatch(/^\+1\d{10}$/);
  });

  it('SHOP_PHONE_DISPLAY should be formatted', () => {
    expect(SHOP_PHONE_DISPLAY).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
  });
});

describe('getOpeningHoursSpecification', () => {
  const hours = getOpeningHoursSpecification();

  it('should return array of OpeningHoursSpecification', () => {
    expect(hours.length).toBeGreaterThan(0);
    hours.forEach((h) => {
      expect(h['@type']).toBe('OpeningHoursSpecification');
    });
  });

  it('should have valid time format (HH:MM)', () => {
    hours.forEach((h) => {
      expect(h.opens).toMatch(/^\d{2}:\d{2}$/);
      expect(h.closes).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  it('should include weekday hours', () => {
    const weekday = hours.find((h) => Array.isArray(h.dayOfWeek));
    expect(weekday).toBeDefined();
    expect(weekday!.dayOfWeek).toContain('Monday');
    expect(weekday!.dayOfWeek).toContain('Friday');
  });
});

describe('getGeoCoordinates', () => {
  const geo = getGeoCoordinates();

  it('should return GeoCoordinates type', () => {
    expect(geo['@type']).toBe('GeoCoordinates');
  });

  it('should have numeric lat/lng', () => {
    expect(typeof geo.latitude).toBe('number');
    expect(typeof geo.longitude).toBe('number');
  });
});

describe('getPostalAddress', () => {
  const address = getPostalAddress();

  it('should return PostalAddress type', () => {
    expect(address['@type']).toBe('PostalAddress');
  });

  it('should include all required fields', () => {
    expect(address.streetAddress).toBeTruthy();
    expect(address.addressLocality).toBeTruthy();
    expect(address.addressRegion).toBeTruthy();
    expect(address.postalCode).toBeTruthy();
    expect(address.addressCountry).toBeTruthy();
  });
});

describe('getAggregateRating', () => {
  it('should use defaults when no args provided', () => {
    const rating = getAggregateRating();
    expect(rating['@type']).toBe('AggregateRating');
    expect(rating.ratingValue).toBe(RATING_INFO.ratingValue);
    expect(rating.reviewCount).toBe(RATING_INFO.reviewCount);
    expect(rating.bestRating).toBe(5);
    expect(rating.worstRating).toBe(1);
  });

  it('should use custom values when provided', () => {
    const rating = getAggregateRating(4.9, 500);
    expect(rating.ratingValue).toBe(4.9);
    expect(rating.reviewCount).toBe(500);
  });
});
