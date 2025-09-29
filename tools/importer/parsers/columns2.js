/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children of the grid
  function getGridChildren(grid) {
    return Array.from(grid.querySelectorAll(':scope > div'));
  }

  // Find the grid wrapper (aem-Grid)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children (logo, navigation, search)
  const gridChildren = getGridChildren(grid);

  // Defensive: find logo, navigation, search by class
  const logo = gridChildren.find((child) => child.classList.contains('image'));
  const navigation = gridChildren.find((child) => child.classList.contains('navigation'));
  const search = gridChildren.find((child) => child.classList.contains('search'));

  // Defensive: fallback to empty elements if not found
  const logoContent = logo ? logo : document.createElement('div');
  const navigationContent = navigation ? navigation : document.createElement('div');
  const searchContent = search ? search : document.createElement('div');

  // Table header
  const headerRow = ['Columns (columns2)'];

  // Table row: 3 columns (logo, navigation, search)
  const contentRow = [logoContent, navigationContent, searchContent];

  // Compose table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
