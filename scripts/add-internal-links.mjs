// Add internal links to blog post content from a plan file.
//
// Each plan entry wraps an exact phrase that already exists in a post with a
// link to another page. No copy is added or changed: the anchor text must be
// found verbatim inside a single text node, or the entry is skipped.
//
// Dry run (default) — reads the live posts through the public API and reports
// what would change. Needs no credentials:
//   node scripts/add-internal-links.mjs
//
// Apply — logs in as a CMS user and saves each changed post. Payload keeps the
// previous version, so any post can be restored from its Versions tab:
//   PAYLOAD_EMAIL=… PAYLOAD_PASSWORD=… node scripts/add-internal-links.mjs --apply
//
// Options: --plan <file> (default scripts/internal-links-plan.json),
//          PAYLOAD_URL (default https://www.prestigeautobodyinc.com).
// Safe to re-run: links that are already in place are reported and skipped.

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Element types whose direct text children may receive a link. */
const LINKABLE_PARENTS = new Set(['paragraph', 'listitem', 'quote']);

function linkNode(url, textNode) {
  return {
    type: 'link',
    fields: { url, newTab: false, linkType: 'custom' },
    children: [textNode],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 3,
  };
}

function* elements(node) {
  if (Array.isArray(node.children)) {
    yield node;
    for (const child of node.children) yield* elements(child);
  }
}

function alreadyLinked(root, url, anchor) {
  for (const el of elements(root)) {
    if (el.type !== 'link' || el.fields?.url !== url) continue;
    const text = el.children.map((c) => c.text ?? '').join('');
    if (text === anchor) return true;
  }
  return false;
}

/**
 * Wrap `anchor` in a link to `url` in a Lexical document. Returns the status
 * and, when linked, a new document (the input is not mutated).
 */
export function addLink(content, anchor, url) {
  const doc = structuredClone(content);
  if (alreadyLinked(doc.root, url, anchor)) return { status: 'already' };

  const matches = [];
  for (const el of elements(doc.root)) {
    if (!LINKABLE_PARENTS.has(el.type)) continue;
    el.children.forEach((child, index) => {
      if (child.type === 'text' && child.text.includes(anchor)) {
        matches.push({ parent: el, index });
      }
    });
  }
  if (matches.length === 0) return { status: 'not-found' };
  if (matches.length > 1) return { status: 'ambiguous' };

  const { parent, index } = matches[0];
  const node = parent.children[index];
  const start = node.text.indexOf(anchor);
  if (node.text.indexOf(anchor, start + 1) !== -1)
    return { status: 'ambiguous' };

  const piece = (text) => ({ ...node, text });
  const before = node.text.slice(0, start);
  const after = node.text.slice(start + anchor.length);
  parent.children.splice(
    index,
    1,
    ...(before ? [piece(before)] : []),
    linkNode(url, piece(anchor)),
    ...(after ? [piece(after)] : []),
  );
  return { status: 'linked', content: doc };
}

async function api(base, path, init = {}) {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init.headers },
  });
  if (!res.ok) {
    throw new Error(
      `${init.method ?? 'GET'} ${path}: ${res.status} ${await res.text()}`,
    );
  }
  return res.json();
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const planIndex = args.indexOf('--plan');
  const planFile =
    planIndex === -1 ? 'scripts/internal-links-plan.json' : args[planIndex + 1];
  const base = (
    process.env.PAYLOAD_URL ?? 'https://www.prestigeautobodyinc.com'
  ).replace(/\/$/, '');
  const plan = JSON.parse(readFileSync(planFile, 'utf8'));

  let auth = {};
  if (apply) {
    const { PAYLOAD_EMAIL: email, PAYLOAD_PASSWORD: password } = process.env;
    if (!email || !password) {
      console.error('--apply needs PAYLOAD_EMAIL and PAYLOAD_PASSWORD.');
      process.exit(1);
    }
    const { token } = await api(base, '/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    auth = { Authorization: `JWT ${token}` };
  }

  // Group by post and locale so each post is fetched and saved once.
  const groups = new Map();
  for (const entry of plan) {
    const key = `${entry.locale}:${entry.source}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }

  const totals = { linked: 0, already: 0, 'not-found': 0, ambiguous: 0 };
  for (const [key, entries] of groups) {
    const [locale, slug] = key.split(':');
    const query = `/api/blog-posts?locale=${locale}&depth=0&limit=1&where[slug][equals]=${encodeURIComponent(slug)}`;
    const { docs } = await api(base, query, { headers: auth });
    if (!docs.length) {
      console.log(`✗ /${locale}/blog/${slug}: post not found`);
      totals['not-found'] += entries.length;
      continue;
    }

    let content = docs[0].content;
    let changed = 0;
    for (const { anchor, target } of entries) {
      const result = addLink(content, anchor, target);
      totals[result.status] += 1;
      if (result.status === 'linked') {
        content = result.content;
        changed += 1;
      }
      const mark = {
        linked: '+',
        already: '=',
        'not-found': '✗',
        ambiguous: '?',
      }[result.status];
      console.log(
        `${mark} /${locale}/blog/${slug}: "${anchor}" → ${target} (${result.status})`,
      );
    }

    if (apply && changed > 0) {
      await api(base, `/api/blog-posts/${docs[0].id}?locale=${locale}`, {
        method: 'PATCH',
        headers: auth,
        body: JSON.stringify({ content }),
      });
      console.log(`  saved /${locale}/blog/${slug} (${changed} new link(s))`);
    }
  }

  console.log(
    `\n${apply ? 'Applied' : 'Dry run'}: ${totals.linked} to add, ${totals.already} already in place, ` +
      `${totals['not-found']} not found, ${totals.ambiguous} ambiguous.`,
  );
  if (!apply && totals.linked > 0) console.log('Re-run with --apply to save.');
  if (totals['not-found'] || totals.ambiguous) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
