import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  RichTextRenderer,
  resolveLinkUrl,
} from '@/components/RichTextRenderer';

function doc(link: Record<string, unknown>) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', text: 'Read ' },
            {
              type: 'link',
              fields: link,
              children: [{ type: 'text', text: 'the guide' }],
            },
          ],
        },
      ],
    },
  };
}

describe('resolveLinkUrl', () => {
  it('keeps custom URLs as they are', () => {
    expect(
      resolveLinkUrl(
        { linkType: 'custom', url: '/es/pintura-de-autos' },
        undefined,
        'es',
      ),
    ).toBe('/es/pintura-de-autos');
  });

  it('builds the localized URL of an internal link to a blog post', () => {
    expect(
      resolveLinkUrl(
        {
          linkType: 'internal',
          doc: {
            relationTo: 'blog-posts',
            value: { slug: 'que-es-un-suplemento-de-carroceria' },
          },
        },
        undefined,
        'es',
      ),
    ).toBe('/es/blog/que-es-un-suplemento-de-carroceria');
  });

  it('has no URL for an unpopulated or non-blog internal link', () => {
    expect(
      resolveLinkUrl(
        {
          linkType: 'internal',
          doc: { relationTo: 'blog-posts', value: 'abc' },
        },
        undefined,
        'en',
      ),
    ).toBeNull();
    expect(
      resolveLinkUrl(
        {
          linkType: 'internal',
          doc: { relationTo: 'pages', value: { slug: 'x' } },
        },
        undefined,
        'en',
      ),
    ).toBeNull();
  });
});

describe('RichTextRenderer links', () => {
  it('renders an internal blog link with the post URL', () => {
    const { container } = render(
      <RichTextRenderer
        locale="en"
        content={doc({
          linkType: 'internal',
          doc: {
            relationTo: 'blog-posts',
            value: { slug: 'hail-damage-repair-guide' },
          },
        })}
      />,
    );
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      '/en/blog/hail-damage-repair-guide',
    );
  });

  it('renders a link without a target as plain text instead of href="#"', () => {
    const { container } = render(
      <RichTextRenderer
        content={doc({
          linkType: 'internal',
          doc: { relationTo: 'pages', value: 'x' },
        })}
      />,
    );
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toBe('Read the guide');
  });
});
