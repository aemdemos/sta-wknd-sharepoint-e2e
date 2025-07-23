/* global WebImporter */
export default function parse(element, { document }) {
  // This block is a language/country header bar with a logo, navigation, and search
  // It should be transformed into a single row Cards (cards2) block, with two columns: logo | navigation+search

  // 1. Find the main content grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // 2. Find the logo/image block (always present)
  const logoCol = grid.querySelector('.image');

  // 3. Find the navigation (may be absent)
  const navCol = grid.querySelector('.navigation');

  // 4. Find the search block (always present)
  const searchCol = grid.querySelector('.search');

  // Defensive: if nothing to show, skip
  if (!logoCol && !navCol && !searchCol) return;

  // 5. Compose navigation+search together into a div (if both present)
  let navSearch;
  if (navCol && searchCol) {
    navSearch = document.createElement('div');
    navSearch.appendChild(navCol);
    navSearch.appendChild(searchCol);
  } else if (navCol) {
    navSearch = navCol;
  } else if (searchCol) {
    navSearch = searchCol;
  } else {
    navSearch = document.createElement('div');
  }

  // 6. Build the cells structure
  const cells = [
    ['Cards (cards2)'],
    [logoCol, navSearch]
  ];

  // 7. Create and replace the block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
