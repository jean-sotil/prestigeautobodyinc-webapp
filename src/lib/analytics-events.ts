export type ServiceType = 'collision' | 'bodywork' | 'painting' | 'insurance';
export type DamageSeverity = 'minor' | 'moderate' | 'major' | 'unsure';
export type FormStep = 1 | 2 | 3 | 4;
export type FormStepWithSubmit = FormStep | 5;
export type StepDirection = 'forward' | 'backward';
export type FormErrorType = 'validation' | 'network' | 'server' | 'rate_limit';

export type WebVitalMetric = 'CLS' | 'INP' | 'LCP' | 'FCP' | 'TTFB';
export type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

export type AnalyticsEvent =
  | { name: 'quote_form_start'; params: { service: ServiceType } }
  | {
      name: 'quote_form_step';
      params: { step_number: FormStepWithSubmit; direction: StepDirection };
    }
  | {
      name: 'quote_form_abandon';
      params: { last_step: FormStep; time_spent_seconds: number };
    }
  | {
      name: 'quote_form_submit';
      params: { service_type: ServiceType; damage_severity: DamageSeverity };
    }
  | {
      name: 'quote_form_error';
      params: { step: FormStep; error_type: FormErrorType };
    }
  | {
      name: 'web_vitals';
      params: {
        metric_name: WebVitalMetric;
        value: number;
        rating: WebVitalRating;
      };
    };

export type EventName = AnalyticsEvent['name'];
export type EventParams<N extends EventName> = Extract<
  AnalyticsEvent,
  { name: N }
>['params'];

export type UserProperties = {
  theme?: 'light' | 'dark';
  locale?: 'en' | 'es';
};
