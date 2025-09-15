/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article block
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the content area inside the contentfragment
  const fragmentElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!fragmentElements) return;

  // Helper: get all direct children (block-level nodes)
  function getDirectChildren(parent) {
    return Array.from(parent.childNodes).filter((node) => {
      return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
    });
  }

  // Flatten all children into a list for easier traversal
  const children = getDirectChildren(fragmentElements);

  // Find all h2 titles and their indices
  const h2s = [];
  children.forEach((child, idx) => {
    if (child.querySelector) {
      const h2 = child.querySelector('h2.cmp-title__text');
      if (h2) {
        h2s.push({ h2, idx });
      }
    }
  });

  // Accordion block header row
  const headerRow = ['Accordion (accordion18)'];
  const rows = [headerRow];

  // For each accordion section
  for (let i = 0; i < h2s.length; i++) {
    const { h2, idx } = h2s[i];
    // Title cell: clone the h2 element so we don't move it from the DOM
    const titleCell = h2.cloneNode(true);
    // Content cell: collect all elements between this h2 and the next h2
    const nextIdx = (i + 1 < h2s.length) ? h2s[i + 1].idx : children.length;
    const contentElements = [];
    for (let j = idx + 1; j < nextIdx; j++) {
      const el = children[j];
      // Defensive: skip empty divs
      if (el.nodeType === 1 && el.tagName === 'DIV' && el.childNodes.length === 0) continue;
      // Defensive: skip whitespace text nodes
      if (el.nodeType === 3 && !el.textContent.trim()) continue;
      // Clone the element to avoid moving from DOM
      contentElements.push(el.cloneNode(true));
    }
    // Only add row if contentElements is not empty
    if (contentElements.length > 0) {
      // Flatten single element, otherwise array
      const contentCell = contentElements.length === 1 ? contentElements[0] : contentElements;
      rows.push([titleCell, contentCell]);
    }
  }

  // If at least one accordion item, replace the contentfragment with the accordion table
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    contentFragment.replaceWith(table);
  }
}
