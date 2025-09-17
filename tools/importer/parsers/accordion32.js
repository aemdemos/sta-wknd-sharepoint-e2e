/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main content fragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Helper to collect accordion items
  const accordionItems = [];

  // Find all direct children in the content fragment elements
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll iterate through the children of elementsContainer
  // and group content between each section title (h2) as an accordion item
  let currentTitle = null;
  let currentContent = [];

  // Flatten all relevant children (paragraphs, blocks, images, titles)
  // We'll use a tree walker to get all elements in order
  const walker = document.createTreeWalker(
    elementsContainer,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        // Accept paragraphs, images, blockquotes, and section titles (h2)
        if (
          node.tagName === 'P' ||
          node.tagName === 'BLOCKQUOTE' ||
          node.classList.contains('cmp-title') ||
          node.classList.contains('cmp-image')
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    },
    false
  );

  // Collect all relevant nodes in order
  const nodes = [];
  let n = walker.nextNode();
  while (n) {
    nodes.push(n);
    n = walker.nextNode();
  }

  // The first node is always the h3 title, skip it for accordion
  let startIdx = 0;
  if (nodes.length && nodes[0].tagName === 'H3') {
    startIdx = 1;
  }

  // Iterate and group by h2 section titles
  for (let i = startIdx; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.classList.contains('cmp-title')) {
      // If we already have a title, push previous item
      if (currentTitle && currentContent.length) {
        accordionItems.push([currentTitle, currentContent.length === 1 ? currentContent[0] : currentContent]);
      }
      // New title: get the h2 text
      const h2 = node.querySelector('h2');
      if (h2) {
        currentTitle = h2;
        currentContent = [];
      }
    } else {
      // Content: paragraph, image, blockquote
      currentContent.push(node);
    }
  }
  // Push last item
  if (currentTitle && currentContent.length) {
    accordionItems.push([currentTitle, currentContent.length === 1 ? currentContent[0] : currentContent]);
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];
  accordionItems.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original content fragment with the block
  contentFragment.replaceWith(block);
}
