/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid (row) containing the logo, navigation, and search
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find logo: first child with class containing 'image'
  const logoCol = Array.from(grid.children).find(child => child.className && child.className.includes('cmp-image--logo'));
  // Find navigation: first child with class containing 'cmp-navigation--header'
  const navCol = Array.from(grid.children).find(child => child.className && child.className.includes('cmp-navigation--header'));
  // Find search: first child with class containing 'cmp-search--header'
  const searchCol = Array.from(grid.children).find(child => child.className && child.className.includes('cmp-search--header'));

  // Collect only non-null elements
  const rowContent = [logoCol, navCol, searchCol].filter(Boolean);
  if (rowContent.length === 0) return;

  // Put all columns (logo, nav, search) into a single cell (to match provided example structure)
  const cells = [
    ['Cards (cards2)'],
    [rowContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
