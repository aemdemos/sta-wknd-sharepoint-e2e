/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search block, robustly, and include all relevant content
  let searchSection = null;
  // Try to locate .aem-Grid under this block, otherwise use the element itself
  const grid = element.querySelector('.aem-Grid') || element;
  // Find a child div with class including 'search' (block)
  let searchDiv = null;
  for (const child of grid.children) {
    if (child.className && child.className.includes('search')) {
      searchDiv = child;
      break;
    }
  }
  // Search for section.cmp-search inside that div, or fallback to the div itself
  if (searchDiv) {
    searchSection = searchDiv.querySelector('section.cmp-search') || searchDiv;
  } else {
    // fallback: find first section.cmp-search or [role=search]
    searchSection = element.querySelector('section.cmp-search') || element.querySelector('[role="search"]');
  }

  // If we have a searchSection, use it directly to retain all semantic and text content
  // This ensures placeholder, icons, input, and any text are not missed
  const content = searchSection || element;

  // Construct table
  const cells = [
    ['Search'],
    [content]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
