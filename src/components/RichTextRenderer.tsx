/**
 * Rich Text Content Renderer for Payload CMS Lexical format
 * Converts Lexical JSON to React elements
 */

import React from 'react';

// Lexical node types
interface LexicalTextNode {
  type: 'text';
  text: string;
  format?: number | string;
  style?: string;
  mode?: 'normal' | 'token';
  detail?: number;
}

interface LexicalElementNode {
  type: 'paragraph' | 'heading' | 'quote' | 'list' | 'listitem' | 'link';
  children: LexicalNode[];
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  listType?: 'bullet' | 'number';
  url?: string;
  direction?: 'ltr' | 'rtl' | null;
  format?: string;
  indent?: number;
}

type LexicalNode = LexicalTextNode | LexicalElementNode;

interface LexicalRoot {
  type: 'root';
  children: LexicalNode[];
  direction?: 'ltr' | 'rtl' | null;
  format?: string;
  indent?: number;
  version?: number;
}

interface LexicalDocument {
  root: LexicalRoot;
}

// Text format flags from Lexical
const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;
const IS_SUBSCRIPT = 1 << 5;
const IS_SUPERSCRIPT = 1 << 6;

interface RichTextRendererProps {
  content: LexicalDocument | unknown;
  className?: string;
}

/**
 * Check if node is a text node
 */
function isTextNode(node: LexicalNode): node is LexicalTextNode {
  return node.type === 'text';
}

/**
 * Render text node with formatting
 */
function renderTextNode(node: LexicalTextNode, key: string): React.ReactNode {
  const { text, format } = node;
  let content: React.ReactNode = text;

  // Handle format as number (bitmask) or string
  if (typeof format === 'number') {
    if (format & IS_BOLD) {
      content = <strong>{content}</strong>;
    }
    if (format & IS_ITALIC) {
      content = <em>{content}</em>;
    }
    if (format & IS_UNDERLINE) {
      content = <u>{content}</u>;
    }
    if (format & IS_STRIKETHROUGH) {
      content = <s>{content}</s>;
    }
    if (format & IS_CODE) {
      content = (
        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
          {content}
        </code>
      );
    }
    if (format & IS_SUBSCRIPT) {
      content = <sub>{content}</sub>;
    }
    if (format & IS_SUPERSCRIPT) {
      content = <sup>{content}</sup>;
    }
  } else if (typeof format === 'string') {
    // Handle string format (alternative format style)
    if (format.includes('bold')) {
      content = <strong>{content}</strong>;
    }
    if (format.includes('italic')) {
      content = <em>{content}</em>;
    }
    if (format.includes('underline')) {
      content = <u>{content}</u>;
    }
    if (format.includes('strikethrough')) {
      content = <s>{content}</s>;
    }
  }

  return <React.Fragment key={key}>{content}</React.Fragment>;
}

/**
 * Render a single node
 */
function renderNode(node: LexicalNode, key: string): React.ReactNode {
  if (isTextNode(node)) {
    return renderTextNode(node, key);
  }

  const children = node.children?.map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className="mb-4 leading-relaxed">
          {children}
        </p>
      );

    case 'heading':
      const HeadingTag = node.tag || 'h2';
      const headingClasses: Record<string, string> = {
        h1: 'text-3xl font-bold mb-6 mt-8',
        h2: 'text-2xl font-bold mb-4 mt-6',
        h3: 'text-xl font-bold mb-3 mt-5',
        h4: 'text-lg font-bold mb-2 mt-4',
        h5: 'text-base font-bold mb-2 mt-3',
        h6: 'text-sm font-bold mb-2 mt-2',
      };
      return (
        <HeadingTag
          key={key}
          className={
            headingClasses[HeadingTag] || 'text-xl font-bold mb-4 mt-6'
          }
        >
          {children}
        </HeadingTag>
      );

    case 'quote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
        >
          {children}
        </blockquote>
      );

    case 'list':
      if (node.listType === 'number') {
        return (
          <ol key={key} className="list-decimal list-inside mb-4 ml-4">
            {children}
          </ol>
        );
      }
      return (
        <ul key={key} className="list-disc list-inside mb-4 ml-4">
          {children}
        </ul>
      );

    case 'listitem':
      return <li key={key}>{children}</li>;

    case 'link':
      return (
        <a
          key={key}
          href={node.url || '#'}
          className="text-primary hover:underline"
          target={node.url?.startsWith('http') ? '_blank' : undefined}
          rel={node.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );

    default:
      return <span key={key}>{children}</span>;
  }
}

/**
 * Rich Text Renderer Component
 * Renders Payload CMS Lexical rich text content
 */
export function RichTextRenderer({
  content,
  className,
}: RichTextRendererProps) {
  // Handle null/undefined
  if (!content) {
    return null;
  }

  // Handle if content is already a string
  if (typeof content === 'string') {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Validate Lexical document structure
  const lexicalContent = content as LexicalDocument;
  if (!lexicalContent.root || !Array.isArray(lexicalContent.root.children)) {
    console.warn('Invalid Lexical document structure');
    return null;
  }

  const children = lexicalContent.root.children.map((node, index) =>
    renderNode(node, `root-${index}`),
  );

  return (
    <div
      className={`prose prose-lg max-w-none dark:prose-invert ${className || ''}`}
    >
      {children}
    </div>
  );
}

export default RichTextRenderer;
