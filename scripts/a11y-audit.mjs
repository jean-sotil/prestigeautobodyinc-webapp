#!/usr/bin/env node
// WCAG 2.1 AA accessibility audit using axe-core via Playwright.
// Boots no server itself — point BASE_URL at a running dev/prod/preview build.
//
// Usage:
//   bun run a11y                # scans http://localhost:3000
//   BASE_URL=https://www.prestigeautobodyinc.com bun run a11y
//
// Exits 1 if any critical/serious violations are found.

import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const REPORT_MD = path.resolve('docs/accessibility-audit.md');
const REPORT_JSON = path.resolve('docs/accessibility-audit.json');

// (en path, es path) tuples per page. Mirrors src/i18n/routing.ts pathnames.
const ROUTES = [
  ['/', '/'],
  ['/about', '/nosotros'],
  ['/auto-body-services', '/servicios-de-carroceria'],
  ['/auto-painting', '/pintura-de-autos'],
  ['/blog', '/blog'],
  ['/certifications', '/certificaciones'],
  ['/collision-repair', '/reparacion-de-colisiones'],
  ['/contact', '/contacto'],
  ['/gallery', '/galeria'],
  ['/get-a-quote', '/obtener-cotizacion'],
  ['/insurance-claims', '/reclamos-de-seguro'],
  ['/locations', '/ubicaciones'],
  ['/our-team', '/nuestro-equipo'],
  ['/privacy-policy', '/politica-de-privacidad'],
  ['/rental-assistance', '/asistencia-de-alquiler'],
  ['/terms-of-service', '/terminos-de-servicio'],
  ['/towing', '/remolque'],
];

const URLS = ROUTES.flatMap(([en, es]) => [
  { locale: 'en', url: `${BASE_URL}/en${en === '/' ? '' : en}` },
  { locale: 'es', url: `${BASE_URL}/es${es === '/' ? '' : es}` },
]);

const SEVERITY_ORDER = { critical: 0, serious: 1, moderate: 2, minor: 3 };

async function auditUrl(page, { locale, url }) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page
    .waitForLoadState('networkidle', { timeout: 15_000 })
    .catch(() => {});

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  return {
    locale,
    url,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        html: n.html.slice(0, 240),
        failureSummary: n.failureSummary,
      })),
    })),
  };
}

function severityBucket(violations, levels) {
  return violations.filter((v) => levels.includes(v.impact));
}

function markdown(report) {
  const totals = report.reduce(
    (acc, r) => {
      for (const v of r.violations) {
        acc[v.impact] = (acc[v.impact] ?? 0) + v.nodes.length;
      }
      return acc;
    },
    { critical: 0, serious: 0, moderate: 0, minor: 0 },
  );

  let out = `# Accessibility Audit — WCAG 2.1 AA

**Generated:** ${new Date().toISOString()}
**Base URL:** \`${BASE_URL}\`
**Tool:** axe-core via @axe-core/playwright
**Tags:** wcag2a, wcag2aa, wcag21a, wcag21aa

## Totals (by impact, counting affected nodes)

| Critical | Serious | Moderate | Minor |
| --- | --- | --- | --- |
| ${totals.critical} | ${totals.serious} | ${totals.moderate} | ${totals.minor} |

## Findings per page

`;

  for (const r of report) {
    const blockers = severityBucket(r.violations, ['critical', 'serious']);
    const advisories = severityBucket(r.violations, ['moderate', 'minor']);
    out += `### ${r.locale.toUpperCase()} — \`${r.url}\`\n\n`;
    if (r.violations.length === 0) {
      out += '- ✅ No violations.\n\n';
      continue;
    }
    if (blockers.length === 0) {
      out += `- ✅ No critical/serious violations (${advisories.length} advisory).\n\n`;
    }
    const sorted = [...r.violations].sort(
      (a, b) => SEVERITY_ORDER[a.impact] - SEVERITY_ORDER[b.impact],
    );
    for (const v of sorted) {
      out += `- **${v.impact}** · \`${v.id}\` — ${v.help} ([rule](${v.helpUrl})) · ${v.nodes.length} node(s)\n`;
      for (const n of v.nodes.slice(0, 3)) {
        const target = Array.isArray(n.target) ? n.target.join(' ') : n.target;
        out += `  - \`${target}\`\n`;
      }
      if (v.nodes.length > 3) out += `  - …and ${v.nodes.length - 3} more\n`;
    }
    out += '\n';
  }
  return out;
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const report = [];
  let failures = 0;

  for (const target of URLS) {
    process.stdout.write(`  scanning ${target.url} … `);
    try {
      const r = await auditUrl(page, target);
      report.push(r);
      const blockers = severityBucket(r.violations, ['critical', 'serious']);
      failures += blockers.reduce((n, v) => n + v.nodes.length, 0);
      console.log(
        blockers.length === 0
          ? `ok (${r.violations.length} advisories)`
          : `${blockers.length} blocker rule(s)`,
      );
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      report.push({
        locale: target.locale,
        url: target.url,
        error: err.message,
        violations: [],
      });
    }
  }

  await browser.close();

  await fs.mkdir(path.dirname(REPORT_MD), { recursive: true });
  await fs.writeFile(REPORT_JSON, JSON.stringify(report, null, 2));
  await fs.writeFile(REPORT_MD, markdown(report));

  console.log(`\nReport: ${REPORT_MD}`);
  console.log(`JSON:   ${REPORT_JSON}`);
  console.log(`Critical+serious node violations: ${failures}`);
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
