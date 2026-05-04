import { describe, it, expect } from 'vitest';
import en from '../../messages/en.json';
import es from '../../messages/es.json';

// Recursively collect all leaf keys as dot-notation paths
function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...collectKeys(value as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

const enKeys = collectKeys(en);
const esKeys = collectKeys(es);
const enSet = new Set(enKeys);
const esSet = new Set(esKeys);

describe('Translation Completeness', () => {
  it('EN and ES should have the same number of keys', () => {
    const missingInEs = enKeys.filter((k) => !esSet.has(k));
    const missingInEn = esKeys.filter((k) => !enSet.has(k));

    if (missingInEs.length > 0) {
      console.log('Missing in ES:', missingInEs.slice(0, 10));
    }
    if (missingInEn.length > 0) {
      console.log('Missing in EN:', missingInEn.slice(0, 10));
    }

    expect(missingInEs).toEqual([]);
    expect(missingInEn).toEqual([]);
  });

  it('every EN key should exist in ES', () => {
    const missing = enKeys.filter((k) => !esSet.has(k));
    expect(missing).toEqual([]);
  });

  it('every ES key should exist in EN', () => {
    const missing = esKeys.filter((k) => !enSet.has(k));
    expect(missing).toEqual([]);
  });
});

describe('Translation Values', () => {
  // Helper to get nested value by dot path
  function getByPath(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((acc: unknown, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  it('no EN value should be empty string', () => {
    const empty = enKeys.filter((k) => {
      const val = getByPath(en, k);
      return typeof val === 'string' && val.trim() === '';
    });
    expect(empty).toEqual([]);
  });

  it('no ES value should be empty string', () => {
    const empty = esKeys.filter((k) => {
      const val = getByPath(es, k);
      return typeof val === 'string' && val.trim() === '';
    });
    expect(empty).toEqual([]);
  });

  it('ES translations should differ from EN (not just copied)', () => {
    // Check key sections that MUST be translated
    const criticalNamespaces = [
      'metadata.title',
      'metadata.description',
      'nav.about',
      'nav.home',
      'nav.services',
      'nav.contact',
      'home.pageHero.h1',
      'home.services.collision.title',
      'home.cta.title',
      'footer.hours.title',
      'common.learnMore',
      'common.contactUs',
    ];

    const identical: string[] = [];
    for (const key of criticalNamespaces) {
      const enVal = getByPath(en, key);
      const esVal = getByPath(es, key);
      if (typeof enVal === 'string' && enVal === esVal) {
        identical.push(key);
      }
    }

    // Some keys like brand names may be identical — allow up to 2
    expect(identical.length).toBeLessThanOrEqual(2);
  });
});

describe('Translation Structure — Critical Namespaces', () => {
  const requiredNamespaces = [
    'metadata',
    'nav',
    'home',
    'footer',
    'common',
    'header',
    'about',
    'contact',
    'services',
  ];

  for (const ns of requiredNamespaces) {
    it(`"${ns}" namespace exists in both EN and ES`, () => {
      expect(en).toHaveProperty(ns);
      expect(es).toHaveProperty(ns);
    });
  }
});
