/**
 * Blog Categories Seed Script
 *
 * Run with: pnpm ts-node src/payload/seed/blog-categories.ts
 *
 * Seeds the 5 required blog categories:
 * - Collision Repair
 * - Auto Painting
 * - Insurance Tips
 * - Maintenance
 * - News
 */

import { getPayload } from 'payload';
import config from '../payload.config';

const categories = [
  {
    slug: 'collision-repair',
    name: {
      en: 'Collision Repair',
      es: 'Reparación de Colisiones',
    },
    description: {
      en: 'Expert advice and information about auto body collision repair services, techniques, and what to expect during the repair process.',
      es: 'Consejos expertos e información sobre servicios de reparación de colisiones, técnicas y qué esperar durante el proceso de reparación.',
    },
    sortOrder: 1,
    focusKeyword: {
      en: 'collision repair',
      es: 'reparación de colisiones',
    },
  },
  {
    slug: 'auto-painting',
    name: {
      en: 'Auto Painting',
      es: 'Pintura Automotriz',
    },
    description: {
      en: 'Professional auto painting tips, color matching, paint protection, and everything you need to know about vehicle painting services.',
      es: 'Consejos profesionales de pintura automotriz, coincidencia de colores, protección de pintura y todo lo que necesita saber sobre servicios de pintura de vehículos.',
    },
    sortOrder: 2,
    focusKeyword: {
      en: 'auto painting',
      es: 'pintura automotriz',
    },
  },
  {
    slug: 'insurance-tips',
    name: {
      en: 'Insurance Tips',
      es: 'Consejos de Seguro',
    },
    description: {
      en: 'Navigate the insurance claims process with expert guidance on dealing with insurance companies, understanding your coverage, and maximizing your claim.',
      es: 'Navegue el proceso de reclamos de seguros con orientación experta sobre cómo tratar con compañías de seguros, comprender su cobertura y maximizar su reclamo.',
    },
    sortOrder: 3,
    focusKeyword: {
      en: 'insurance claims',
      es: 'reclamos de seguro',
    },
  },
  {
    slug: 'maintenance',
    name: {
      en: 'Maintenance',
      es: 'Mantenimiento',
    },
    description: {
      en: 'Vehicle maintenance tips, care advice, and best practices to keep your car looking and running its best after repairs.',
      es: 'Consejos de mantenimiento de vehículos, cuidado y mejores prácticas para mantener su automóvil luciendo y funcionando lo mejor posible después de reparaciones.',
    },
    sortOrder: 4,
    focusKeyword: {
      en: 'auto maintenance',
      es: 'mantenimiento automotriz',
    },
  },
  {
    slug: 'news',
    name: {
      en: 'News',
      es: 'Noticias',
    },
    description: {
      en: 'Latest updates, company news, industry trends, and announcements from Prestige Auto Body Inc.',
      es: 'Últimas actualizaciones, noticias de la empresa, tendencias de la industria y anuncios de Prestige Auto Body Inc.',
    },
    sortOrder: 5,
    focusKeyword: {
      en: 'auto body news',
      es: 'noticias taller automotriz',
    },
  },
];

async function seedBlogCategories() {
  console.log('🌱 Seeding blog categories...\n');

  try {
    const payload = await getPayload({ config });

    for (const categoryData of categories) {
      // Check if category already exists
      const existing = await payload.find({
        collection: 'blog-categories',
        where: {
          slug: {
            equals: categoryData.slug,
          },
        },
      });

      if (existing.docs.length > 0) {
        console.log(`  ✓ Category already exists: ${categoryData.name.en}`);
        continue;
      }

      // Create category with localized fields
      await payload.create({
        collection: 'blog-categories',
        data: {
          slug: categoryData.slug,
          name: categoryData.name.en,
          description: categoryData.description.en,
          sortOrder: categoryData.sortOrder,
          isActive: true,
          focusKeyword: categoryData.focusKeyword.en,
        },
      });

      console.log(
        `  ✓ Created category: ${categoryData.name.en} (${categoryData.name.es})`,
      );
    }

    console.log('\n✅ Blog categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding blog categories:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedBlogCategories();
}

export { seedBlogCategories, categories };
