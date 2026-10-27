import { describe, it, expect } from 'vitest';
import { addLink } from '../../scripts/add-internal-links.mjs';

const text = (t: string, format = 0) => ({
  type: 'text',
  text: t,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
});

const doc = (...children: object[]) => ({
  root: { type: 'root', children: [{ type: 'paragraph', children }] },
});

describe('addLink', () => {
  it('wraps the anchor and keeps the text around it', () => {
    const input = doc(text('Check your deductible amount today.'));
    const { status, content } = addLink(
      input,
      'deductible amount',
      '/en/blog/x',
    );

    expect(status).toBe('linked');
    const [before, link, after] = content.root.children[0].children;
    expect(before.text).toBe('Check your ');
    expect(link).toMatchObject({
      type: 'link',
      fields: { url: '/en/blog/x', linkType: 'custom', newTab: false },
      children: [{ text: 'deductible amount' }],
    });
    expect(after.text).toBe(' today.');
  });

  it('keeps the formatting of the node it splits', () => {
    const input = doc(text('Comprehensive Coverage:', 1));
    const { content } = addLink(input, 'Comprehensive Coverage', '/en/blog/y');
    const [link, rest] = content.root.children[0].children;

    expect(link.children[0]).toMatchObject({
      text: 'Comprehensive Coverage',
      format: 1,
    });
    expect(rest).toMatchObject({ text: ':', format: 1 });
  });

  it('does not mutate the input', () => {
    const input = doc(text('a deductible amount'));
    const copy = structuredClone(input);
    addLink(input, 'deductible amount', '/en/blog/x');
    expect(input).toEqual(copy);
  });

  it('is idempotent: a second run reports the link as already in place', () => {
    const first = addLink(
      doc(text('a deductible amount')),
      'deductible amount',
      '/en/blog/x',
    );
    expect(
      addLink(first.content, 'deductible amount', '/en/blog/x').status,
    ).toBe('already');
  });

  it('refuses anchors that span formatting or repeat', () => {
    const split = doc(
      text('Collision', 1),
      text(' or '),
      text('Comprehensive', 1),
    );
    expect(addLink(split, 'Collision or Comprehensive', '/x').status).toBe(
      'not-found',
    );

    const twice = doc(text('rust here and rust there'));
    expect(addLink(twice, 'rust', '/x').status).toBe('ambiguous');
  });

  it('never nests a link inside an existing link', () => {
    const input = doc({
      type: 'link',
      fields: {
        url: '/en/collision-repair',
        linkType: 'custom',
        newTab: false,
      },
      children: [text('collision repair services')],
    });
    expect(addLink(input, 'collision repair', '/x').status).toBe('not-found');
  });
});
