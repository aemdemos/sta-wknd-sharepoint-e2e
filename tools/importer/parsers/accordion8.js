/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (main content)
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the content area to parse
  // It's inside: .cmp-contentfragment__elements > div (the one with h2s and ps)
  const elementsWrapper = contentFragment.querySelector('.cmp-contentfragment__elements');
  let contentDiv = null;
  // Find the <div> which contains the h2s -- typically the last one
  if (elementsWrapper) {
    const elementDivs = Array.from(elementsWrapper.querySelectorAll(':scope > div'));
    // Find one with h2s
    contentDiv = elementDivs.find(d => d.querySelector('h2')) || elementDivs[elementDivs.length - 1];
  }
  // Fallback if not found
  if (!contentDiv) contentDiv = elementsWrapper || contentFragment;

  // Get all direct children (mix of h2, p, div, etc.)
  const nodes = Array.from(contentDiv.childNodes);

  // Accordion rows: each h2 is a title, and everything after until next h2 is content
  const rows = [];
  let currentTitle = null;
  let currentContent = [];

  function flushRow() {
    if (currentTitle && currentContent.length) {
      // Remove wrapping arrays if single node
      rows.push([
        currentTitle,
        currentContent.length === 1 ? currentContent[0] : currentContent.slice()
      ]);
    }
  }

  for (const node of nodes) {
    if (node.nodeType === 1 && node.tagName === 'H2') {
      flushRow();
      currentTitle = node;
      currentContent = [];
    } else if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
      if (currentTitle) {
        currentContent.push(node);
      }
    }
  }
  flushRow(); // flush last one

  // Only create the block if there is at least one accordion item
  if (rows.length === 0) return;

  // Build the table
  const cells = [
    ['Accordion (accordion8)'],
    ...rows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the whole contentfragment with the table
  contentFragment.replaceWith(table);
}
