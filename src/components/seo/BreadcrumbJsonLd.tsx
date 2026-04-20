import { BUSINESS_INFO } from '@/lib/business';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
  locale?: string;
}

export function BreadcrumbJsonLd({
  items,
  locale = 'en',
}: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item.startsWith('http')
        ? item.item
        : `${BUSINESS_INFO.url}${item.item}`,
    })),
    '@language': locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Helper to generate breadcrumb items for a page
 * @param pageName - The name of the current page
 * @param pagePath - The path of the current page (e.g., '/contact')
 * @param homeName - The name for the home page (translated)
 * @param locale - The current locale
 * @returns Array of breadcrumb items for BreadcrumbJsonLd
 */
export function generateBreadcrumbItems(
  pageName: string,
  pagePath: string,
  homeName: string,
  locale: string = 'en',
): BreadcrumbItem[] {
  const homePath = locale === 'en' ? '/en' : `/${locale}`;

  return [
    {
      name: homeName,
      item: homePath,
    },
    {
      name: pageName,
      item: pagePath,
    },
  ];
}

export default BreadcrumbJsonLd;
