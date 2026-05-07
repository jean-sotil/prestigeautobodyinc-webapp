#!/usr/bin/env node
// WCAG 2.1 AA contrast audit at the design-token level.
// Parses src/app/globals.css :root and .dark variable blocks, then computes
// contrast ratios for canonical text/background and graphical-element pairs.
//
// Decision: this script replaces a per-theme axe pass. Axe only sees computed
// pixel colors at runtime; this checks the source-of-truth tokens directly,
// so a regression like "someone darkens --bg-card" gets caught even if no
// page currently uses it next to --text-secondary.
//
// Usage:
//   node scripts/contrast-audit.mjs
// Exits 1 if any required pair fails its WCAG threshold.
//
// Notes:
// - Supports #rgb / #rrggbb / oklch(L C h) / oklch(L C h / A).
// - color-mix() and currentColor are skipped (not used in text/bg pairs).
// - Alpha is treated as opaque for now (no transparent tokens in pairs).

import fs from 'node:fs/promises';
import path from 'node:path';

const CSS_PATH = path.resolve('src/app/globals.css');
const REPORT_MD = path.resolve('docs/accessibility/reports/contrast.md');
const REPORT_JSON = path.resolve('docs/accessibility/reports/contrast.json');

// ─── Pairs to verify ──────────────────────────────────────────────
// kind: 'text-normal' (≥4.5:1), 'text-large' (≥3:1), 'graphical' (≥3:1)
// Each pair is checked against both light (:root) and dark (.dark) blocks.
const PAIRS = [
  // Body text on canonical surfaces
  {
    fg: '--foreground',
    bg: '--background',
    kind: 'text-normal',
    label: 'Body text on background',
  },
  {
    fg: '--foreground',
    bg: '--card',
    kind: 'text-normal',
    label: 'Body text on card',
  },
  {
    fg: '--foreground',
    bg: '--muted',
    kind: 'text-normal',
    label: 'Body text on muted surface',
  },
  {
    fg: '--foreground',
    bg: '--secondary',
    kind: 'text-normal',
    label: 'Body text on secondary surface',
  },
  {
    fg: '--foreground',
    bg: '--popover',
    kind: 'text-normal',
    label: 'Body text on popover',
  },

  // Secondary text
  {
    fg: '--muted-foreground',
    bg: '--background',
    kind: 'text-normal',
    label: 'Muted text on background',
  },
  {
    fg: '--muted-foreground',
    bg: '--card',
    kind: 'text-normal',
    label: 'Muted text on card',
  },
  {
    fg: '--muted-foreground',
    bg: '--muted',
    kind: 'text-normal',
    label: 'Muted text on muted surface',
  },

  // Foreground tokens on their paired surfaces
  {
    fg: '--primary-foreground',
    bg: '--primary',
    kind: 'text-normal',
    label: 'Primary button text',
  },
  {
    fg: '--secondary-foreground',
    bg: '--secondary',
    kind: 'text-normal',
    label: 'Secondary button text',
  },
  {
    fg: '--accent-foreground',
    bg: '--accent',
    kind: 'text-normal',
    label: 'Accent surface text',
  },
  {
    fg: '--popover-foreground',
    bg: '--popover',
    kind: 'text-normal',
    label: 'Popover text',
  },
  {
    fg: '--card-foreground',
    bg: '--card',
    kind: 'text-normal',
    label: 'Card text',
  },

  // Brand color used as text on neutral surfaces.
  // Brand-color text is restricted in this codebase to headings, links, and
  // button labels — never body text. Per WCAG, text-large (≥18pt or ≥14pt
  // bold) needs ≥3:1, so these pairs are evaluated at the large-text bar.
  // The usage rule is enforced by code review, not the script.
  {
    fg: '--primary',
    bg: '--background',
    kind: 'text-large',
    label: 'Primary brand text on background (heading/link)',
  },
  {
    fg: '--primary',
    bg: '--card',
    kind: 'text-large',
    label: 'Primary brand text on card (heading/link)',
  },
  {
    fg: '--destructive',
    bg: '--background',
    kind: 'text-normal',
    label: 'Destructive text on background',
  },

  // Graphical / non-text (≥ 3:1)
  {
    fg: '--ring',
    bg: '--background',
    kind: 'graphical',
    label: 'Focus ring on background',
  },
  {
    fg: '--ring',
    bg: '--card',
    kind: 'graphical',
    label: 'Focus ring on card',
  },
  {
    fg: '--ring',
    bg: '--muted',
    kind: 'graphical',
    label: 'Focus ring on muted surface',
  },
  {
    fg: '--input',
    bg: '--background',
    kind: 'graphical',
    label: 'Input border on background',
  },

  // --border is used for cards, dividers, and other purely decorative
  // separators — WCAG 1.4.11 exempts pure decoration. Marked advisory so
  // ratio is reported but does not block the audit.
  {
    fg: '--border',
    bg: '--background',
    kind: 'graphical',
    label: 'Decorative border on background',
    advisory: true,
  },

  // Restricted-use tokens (gold = badge ONLY; steel = icons/dividers ONLY)
  // Audited against both common surfaces; spec restricts usage so failures
  // here mean the *usage rules* must be enforced at the component level.
  {
    fg: '--color-gold-badge',
    bg: '--background',
    kind: 'text-normal',
    label: 'Gold badge text on background',
    advisory: true,
  },
  {
    fg: '--color-gold-badge',
    bg: '--card',
    kind: 'text-normal',
    label: 'Gold badge text on card',
    advisory: true,
  },
  {
    fg: '--color-steel-chrome',
    bg: '--background',
    kind: 'text-normal',
    label: 'Steel-chrome on background',
    advisory: true,
  },
  {
    fg: '--color-steel-chrome',
    bg: '--background',
    kind: 'graphical',
    label: 'Steel-chrome as icon/divider on background',
  },
];

const THRESHOLD = { 'text-normal': 4.5, 'text-large': 3, graphical: 3 };

// ─── CSS variable parsing ─────────────────────────────────────────
function parseBlock(css, selector) {
  const re = new RegExp(`${selector}\\s*\\{([^}]+)\\}`, 's');
  const m = css.match(re);
  if (!m) throw new Error(`No ${selector} block found in globals.css`);
  const out = {};
  for (const line of m[1].split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('/*') || t.startsWith('//')) continue;
    const kv = t.match(/^(--[\w-]+)\s*:\s*(.+?);?$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

// ─── Color value resolution ───────────────────────────────────────
function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  if (h.length === 4)
    h =
      h
        .slice(0, 3)
        .split('')
        .map((c) => c + c)
        .join('') +
      h[3] +
      h[3];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}

// oklch(L C h) -> linear sRGB -> sRGB. Per Björn Ottosson's spec.
function oklchToSrgb(L, C, h) {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  // OKLab -> LMS (cube of)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;
  // LMS -> linear sRGB
  let r = +4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  let g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  let bb = -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc;
  // Clamp into [0, 1] (gamut clipping — adequate for AA contrast estimates)
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  bb = Math.max(0, Math.min(1, bb));
  // Linear -> sRGB gamma-encoded
  const enc = (v) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return [enc(r), enc(g), enc(bb)];
}

function parseColor(value, vars) {
  const v = value.trim();
  if (v.startsWith('var(')) {
    const inner = v.match(/var\((--[\w-]+)\)/);
    if (!inner) return null;
    const ref = vars[inner[1]];
    if (!ref) return null;
    return parseColor(ref, vars);
  }
  if (v.startsWith('#')) return hexToRgb(v);
  const okl = v.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
  if (okl)
    return oklchToSrgb(
      parseFloat(okl[1]),
      parseFloat(okl[2]),
      parseFloat(okl[3]),
    );
  // color-mix / currentColor / unsupported — caller decides whether to skip
  return null;
}

// ─── Contrast math (WCAG 2.1) ─────────────────────────────────────
function relLum([r, g, b]) {
  const lin = (c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(c1, c2) {
  const l1 = relLum(c1);
  const l2 = relLum(c2);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function rgbToHex([r, g, b]) {
  const c = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

// ─── Audit ────────────────────────────────────────────────────────
async function main() {
  const css = await fs.readFile(CSS_PATH, 'utf8');
  // @theme inline holds tokens like --color-gold-badge / --color-steel-chrome
  // that aren't on :root or .dark but are still part of the design system.
  // Merge them in (theme block tokens are theme-agnostic — same in both modes).
  const themeInline = parseBlock(css, '@theme inline');
  const themes = {
    light: { ...themeInline, ...parseBlock(css, ':root') },
    dark: { ...themeInline, ...parseBlock(css, '\\.dark') },
  };

  const results = [];
  let failures = 0;

  for (const [themeName, vars] of Object.entries(themes)) {
    for (const pair of PAIRS) {
      const fgRaw = vars[pair.fg];
      const bgRaw = vars[pair.bg];
      if (!fgRaw || !bgRaw) {
        results.push({
          theme: themeName,
          pair: pair.label,
          status: 'skip',
          reason: `missing token (${!fgRaw ? pair.fg : pair.bg})`,
        });
        continue;
      }
      const fg = parseColor(fgRaw, vars);
      const bg = parseColor(bgRaw, vars);
      if (!fg || !bg) {
        results.push({
          theme: themeName,
          pair: pair.label,
          status: 'skip',
          reason: `unsupported color expression (fg=${fgRaw}, bg=${bgRaw})`,
        });
        continue;
      }
      const ratio = contrastRatio(fg, bg);
      const need = THRESHOLD[pair.kind];
      const pass = ratio >= need;
      const status = pass ? 'pass' : pair.advisory ? 'advisory' : 'fail';
      if (status === 'fail') failures += 1;
      results.push({
        theme: themeName,
        pair: pair.label,
        kind: pair.kind,
        fg: pair.fg,
        bg: pair.bg,
        fgHex: rgbToHex(fg),
        bgHex: rgbToHex(bg),
        ratio: Number(ratio.toFixed(2)),
        need,
        status,
      });
    }
  }

  const md = renderMarkdown(results, failures);
  await fs.mkdir(path.dirname(REPORT_MD), { recursive: true });
  await fs.writeFile(REPORT_JSON, JSON.stringify(results, null, 2));
  await fs.writeFile(REPORT_MD, md);

  console.log(`Report: ${REPORT_MD}`);
  console.log(`JSON:   ${REPORT_JSON}`);
  console.log(`Failures (non-advisory): ${failures}`);
  process.exit(failures > 0 ? 1 : 0);
}

function renderMarkdown(results, failures) {
  const groups = { light: [], dark: [] };
  for (const r of results) groups[r.theme].push(r);

  const totalsByTheme = (rs) =>
    rs.reduce(
      (a, r) => {
        a[r.status] = (a[r.status] ?? 0) + 1;
        return a;
      },
      { pass: 0, fail: 0, advisory: 0, skip: 0 },
    );

  const tl = totalsByTheme(groups.light);
  const td = totalsByTheme(groups.dark);

  let out = `# Contrast Audit — WCAG 2.1 AA (token-level)

**Generated:** ${new Date().toISOString()}
**Source:** \`src/app/globals.css\` (\`:root\` + \`.dark\`)
**Pairs evaluated:** ${PAIRS.length} per theme
**Failures (non-advisory):** ${failures}

| Theme | Pass | Fail | Advisory | Skip |
| --- | --- | --- | --- | --- |
| light | ${tl.pass} | ${tl.fail} | ${tl.advisory} | ${tl.skip} |
| dark  | ${td.pass} | ${td.fail} | ${td.advisory} | ${td.skip} |

`;

  for (const theme of ['light', 'dark']) {
    out += `## ${theme.toUpperCase()} theme\n\n`;
    out += `| Pair | Kind | Foreground | Background | Ratio | Required | Status |\n`;
    out += `| --- | --- | --- | --- | --- | --- | --- |\n`;
    for (const r of groups[theme]) {
      if (r.status === 'skip') {
        out += `| ${r.pair} | — | — | — | — | — | skip (${r.reason}) |\n`;
        continue;
      }
      const icon =
        r.status === 'pass' ? '✅' : r.status === 'advisory' ? '⚠️' : '❌';
      out += `| ${r.pair} | ${r.kind} | \`${r.fg}\` (${r.fgHex}) | \`${r.bg}\` (${r.bgHex}) | ${r.ratio.toFixed(2)}:1 | ≥${r.need}:1 | ${icon} ${r.status} |\n`;
    }
    out += '\n';
  }

  out += `\n## Legend

- **pass** — meets WCAG 2.1 AA threshold for the pair's kind.
- **fail** — below threshold; must be fixed before merge.
- **advisory** — restricted-use token (e.g., gold-badge, steel-chrome). Failure here means the token's usage rule must be enforced at the component level (badge bg dark, etc.); it does not block this audit.
- **skip** — token not defined in this theme, or color expression not yet supported (e.g., \`color-mix\`).
`;

  return out;
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
