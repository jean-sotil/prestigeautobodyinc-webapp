import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'en',

  // The localePrefix option set to 'always' means that
  // all pathnames will be prefixed with the locale,
  // including the default locale
  localePrefix: 'always',

  // Pathnames configuration for localized slugs
  pathnames: {
    '/': '/',
    '/collision-repair': {
      en: '/collision-repair',
      es: '/reparacion-de-colisiones',
    },
    '/auto-painting': {
      en: '/auto-painting',
      es: '/pintura-de-autos',
    },
    '/towing': {
      en: '/towing',
      es: '/remolque',
    },
    '/insurance-claims': {
      en: '/insurance-claims',
      es: '/reclamos-de-seguro',
    },
    '/rental-assistance': {
      en: '/rental-assistance',
      es: '/asistencia-de-alquiler',
    },
    '/about': {
      en: '/about',
      es: '/nosotros',
    },
    '/our-team': {
      en: '/our-team',
      es: '/nuestro-equipo',
    },
    '/certifications': {
      en: '/certifications',
      es: '/certificaciones',
    },
    '/contact': {
      en: '/contact',
      es: '/contacto',
    },
    '/locations': {
      en: '/locations',
      es: '/ubicaciones',
    },
    '/gallery': {
      en: '/gallery',
      es: '/galeria',
    },
    '/get-a-quote': {
      en: '/get-a-quote',
      es: '/obtener-cotizacion',
    },
    '/privacy-policy': {
      en: '/privacy-policy',
      es: '/politica-de-privacidad',
    },
    '/terms-of-service': {
      en: '/terms-of-service',
      es: '/terminos-de-servicio',
    },
    '/blog': {
      en: '/blog',
      es: '/blog',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
