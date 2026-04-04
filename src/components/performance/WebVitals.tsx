'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

/**
 * Web Vitals reporting thresholds (Google's "Good" thresholds)
 */
const THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint < 2.5s
  INP: 200, // Interaction to Next Paint < 200ms
  CLS: 0.1, // Cumulative Layout Shift < 0.1
  FCP: 1800, // First Contentful Paint < 1.8s
  TTFB: 800, // Time to First Byte < 0.8s
};

type WebVitalMetric = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id: string;
  navigationType?: string;
};

/**
 * Send web vitals metrics to analytics endpoint
 * In production, replace with your analytics service (GA4, Datadog, etc.)
 */
function sendToAnalytics(metric: WebVitalMetric) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, body);
  }

  // Send to analytics endpoint
  // Replace with your actual analytics endpoint
  const analyticsUrl = process.env.NEXT_PUBLIC_ANALYTICS_URL;

  if (analyticsUrl) {
    // Use beacon API for reliable delivery during page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon(analyticsUrl, JSON.stringify(body));
    } else {
      // Fallback to fetch
      fetch(analyticsUrl, {
        body: JSON.stringify(body),
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((err) => {
        console.error('[Web Vitals] Failed to send:', err);
      });
    }
  }

  // Also send to Google Analytics 4 if gtag is available
  if (
    typeof window !== 'undefined' &&
    (
      window as unknown as {
        gtag?: (
          cmd: string,
          name: string,
          params: Record<string, unknown>,
        ) => void;
      }
    ).gtag
  ) {
    const gtag = (
      window as unknown as {
        gtag: (
          cmd: string,
          name: string,
          params: Record<string, unknown>,
        ) => void;
      }
    ).gtag;
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_rating: metric.rating,
    });
  }
}

/**
 * Web Vitals monitoring component
 * Reports Core Web Vitals to analytics for Real User Monitoring (RUM)
 *
 * Implements:
 * - LCP (Largest Contentful Paint)
 * - INP (Interaction to Next Paint) - replaces FID
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */
export function WebVitals() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // LCP - Largest Contentful Paint
    onLCP((metric) => {
      sendToAnalytics({
        name: 'LCP',
        value: metric.value,
        rating:
          metric.value <= THRESHOLDS.LCP
            ? 'good'
            : metric.value <= 4000
              ? 'needs-improvement'
              : 'poor',
        id: metric.id,
      });
    });

    // INP - Interaction to Next Paint (replaces FID)
    onINP((metric) => {
      sendToAnalytics({
        name: 'INP',
        value: metric.value,
        rating:
          metric.value <= THRESHOLDS.INP
            ? 'good'
            : metric.value <= 500
              ? 'needs-improvement'
              : 'poor',
        id: metric.id,
      });
    });

    // CLS - Cumulative Layout Shift
    onCLS((metric) => {
      sendToAnalytics({
        name: 'CLS',
        value: metric.value,
        rating:
          metric.value <= THRESHOLDS.CLS
            ? 'good'
            : metric.value <= 0.25
              ? 'needs-improvement'
              : 'poor',
        id: metric.id,
      });
    });

    // FCP - First Contentful Paint
    onFCP((metric) => {
      sendToAnalytics({
        name: 'FCP',
        value: metric.value,
        rating:
          metric.value <= THRESHOLDS.FCP
            ? 'good'
            : metric.value <= 3000
              ? 'needs-improvement'
              : 'poor',
        id: metric.id,
      });
    });

    // TTFB - Time to First Byte
    onTTFB((metric) => {
      sendToAnalytics({
        name: 'TTFB',
        value: metric.value,
        rating:
          metric.value <= THRESHOLDS.TTFB
            ? 'good'
            : metric.value <= 1800
              ? 'needs-improvement'
              : 'poor',
        id: metric.id,
      });
    });
  }, []);

  // This component doesn't render anything visible
  return null;
}
