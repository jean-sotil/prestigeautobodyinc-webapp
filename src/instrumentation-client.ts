import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import { trackEvent } from '@/lib/analytics';
import type { WebVitalMetric } from '@/lib/analytics-events';

function report(metric: Metric) {
  trackEvent('web_vitals', {
    metric_name: metric.name as WebVitalMetric,
    value: Math.round(
      metric.name === 'CLS' ? metric.value * 1000 : metric.value,
    ),
    rating: metric.rating,
  });
}

onCLS(report);
onINP(report);
onLCP(report);
onFCP(report);
onTTFB(report);
