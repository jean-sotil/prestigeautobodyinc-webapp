/**
 * Compute reading time (in minutes) for a Payload Lexical rich-text document.
 * Walks the node tree, sums word counts, divides by 220 wpm, rounds up.
 */

const WORDS_PER_MINUTE = 220;

interface LexicalTextNode {
  type: 'text';
  text?: string;
}

interface LexicalElementNode {
  type: string;
  children?: LexicalNode[];
}

type LexicalNode = LexicalTextNode | LexicalElementNode;

interface LexicalDocument {
  root?: {
    children?: LexicalNode[];
  };
}

function isTextNode(node: LexicalNode): node is LexicalTextNode {
  return node.type === 'text';
}

function countWords(nodes: LexicalNode[] | undefined): number {
  if (!nodes) return 0;
  let total = 0;
  for (const node of nodes) {
    if (isTextNode(node)) {
      const text = node.text?.trim();
      if (text) total += text.split(/\s+/).filter(Boolean).length;
    } else {
      total += countWords(node.children);
    }
  }
  return total;
}

export function computeReadingTime(content: unknown): number {
  const words = countWords((content as LexicalDocument | null)?.root?.children);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
