import { describe, it, expect } from 'vitest';
import {
  generateReferenceId,
  sanitizeInput,
  normalizePhone,
  formatPhoneDisplay,
  hashIp,
} from '@/app/api/quote/lib/schema';

describe('Quote API Helpers', () => {
  describe('generateReferenceId', () => {
    it('should match PAB-YYYYMMDD-XXXX format', () => {
      expect(generateReferenceId()).toMatch(/^PAB-\d{8}-[A-Z0-9]{4}$/);
    });

    it('should generate unique IDs', () => {
      const ids = new Set(Array.from({ length: 20 }, generateReferenceId));
      expect(ids.size).toBeGreaterThan(1);
    });
  });

  describe('sanitizeInput', () => {
    it('should strip HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe(
        'alert("xss")Hello',
      );
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('normalizePhone', () => {
    it('should strip non-digit characters', () => {
      expect(normalizePhone('(714) 630-5959')).toBe('7146305959');
    });

    it('should keep digits only', () => {
      expect(normalizePhone('+1-714-630-5959')).toBe('17146305959');
    });
  });

  describe('formatPhoneDisplay', () => {
    it('should format 10-digit phone', () => {
      expect(formatPhoneDisplay('7146305959')).toBe('(714) 630-5959');
    });

    it('should format 11-digit phone with country code', () => {
      expect(formatPhoneDisplay('17146305959')).toBe('+1 (714) 630-5959');
    });

    it('should return as-is for other lengths', () => {
      expect(formatPhoneDisplay('123')).toBe('123');
    });
  });

  describe('hashIp', () => {
    it('should return a 64-char hex string (SHA-256)', () => {
      expect(hashIp('127.0.0.1')).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce different hashes for different IPs', () => {
      expect(hashIp('127.0.0.1')).not.toBe(hashIp('192.168.1.1'));
    });

    it('should be deterministic', () => {
      expect(hashIp('10.0.0.1')).toBe(hashIp('10.0.0.1'));
    });
  });
});
