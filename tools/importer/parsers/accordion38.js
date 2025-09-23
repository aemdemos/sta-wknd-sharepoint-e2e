/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment/article
  const contentFragment = element.querySelector('article.contentfragment, article.cmp-contentfragment, article[data-cmp-contentfragment-model]');
  if (!contentFragment) return;

  // Find the main content area
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  // Get all direct children (blocks, paragraphs, grids, etc.)
  const children = Array.from(elementsRoot.children);

  // Find all <h2> elements and their indices
  const h2Indices = [];
  children.forEach((child, idx) => {
    if (child.querySelector && child.querySelector('h2')) {
      h2Indices.push(idx);
    }
  });

  const rows = [];
  const headerRow = ['Accordion (accordion38)'];
  rows.push(headerRow);

  // For each h2 section, create a row for the accordion
  for (let i = 0; i < h2Indices.length; i++) {
    const h2Idx = h2Indices[i];
    const nextIdx = h2Indices[i + 1] || children.length;
    const h2El = children[h2Idx].querySelector('h2');
    const title = h2El ? h2El.textContent.trim() : '';
    let sectionContent = [];
    // If the h2's parent contains other children, include them (except h2 itself)
    Array.from(children[h2Idx].children).forEach(child => {
      if (child !== h2El) sectionContent.push(child.cloneNode(true));
    });
    // Add all following siblings up to next h2
    for (let j = h2Idx + 1; j < nextIdx; j++) {
      sectionContent.push(children[j].cloneNode(true));
    }
    // Only add if sectionContent contains non-empty nodes
    if (title && sectionContent.some(node => node.textContent.trim())) {
      rows.push([
        title,
        sectionContent
      ]);
    }
  }

  // Defensive: if no items found, fallback to whole contentfragment
  if (rows.length === 1) {
    rows.push([
      'Main',
      [contentFragment.cloneNode(true)]
    ]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
