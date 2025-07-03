/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search block (e.g., section.cmp-search or div.search)
  let searchSection = element.querySelector('section.cmp-search, .search, .cmp-search--header');
  // If it's a wrapper div, try to get the actual section inside
  if (searchSection && !searchSection.classList.contains('cmp-search')) {
    const innerSection = searchSection.querySelector('section.cmp-search');
    if (innerSection) searchSection = innerSection;
  }
  // Fallback if not found
  if (!searchSection) searchSection = element;

  // Compose a fragment containing all relevant visible text and input structure
  const frag = document.createDocumentFragment();

  // Look for all significant descendants, but maintain visual/semantic structure
  // (For search, the input and possible label/placeholder are key)
  // Reference the existing searchSection (not clone)
  frag.append(searchSection);

  // Table header must match exactly
  const headerRow = ['Search'];
  const cells = [
    headerRow,
    [frag]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
