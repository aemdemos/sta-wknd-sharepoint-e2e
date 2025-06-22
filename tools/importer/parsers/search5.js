/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the search block (cmp-search or cmp-search--header)
  let searchSection = element.querySelector('.cmp-search, .cmp-search--header, section[role="search"]');
  if (!searchSection) {
    // Fallback to first element with 'search' in its class
    searchSection = Array.from(element.querySelectorAll('*')).find(el => el.className && el.className.includes('search'));
  }
  if (!searchSection) {
    // Fallback: use the whole element
    searchSection = element;
  }

  // 2. Gather all direct content (to keep all text & structure)
  let contentNodes = Array.from(searchSection.childNodes).filter(node => {
    if (node.nodeType === Node.ELEMENT_NODE) return true;
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
    return false;
  });
  // If there's only one element or none, just use the section itself
  let contentCell;
  if (contentNodes.length > 0) {
    contentCell = contentNodes;
  } else {
    contentCell = [searchSection];
  }

  // 3. Build the table with the exact header as in the example
  const cells = [
    ['Search'],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
