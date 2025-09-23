/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct children of the grid
  function getGridChildren(el) {
    // Find the grid container
    const grid = el.querySelector('.aem-Grid');
    if (!grid) return [];
    return Array.from(grid.children);
  }

  // Helper: Find the logo image block
  function getLogoImage(el) {
    const gridChildren = getGridChildren(el);
    return gridChildren.find(child => child.classList.contains('image'));
  }

  // Helper: Find the navigation block
  function getNavigation(el) {
    const gridChildren = getGridChildren(el);
    return gridChildren.find(child => child.classList.contains('navigation'));
  }

  // Helper: Find the search block
  function getSearch(el) {
    const gridChildren = getGridChildren(el);
    return gridChildren.find(child => child.classList.contains('search'));
  }

  // Get relevant blocks
  const logoBlock = getLogoImage(element);
  const navigationBlock = getNavigation(element);
  const searchBlock = getSearch(element);

  // Defensive: If any block is missing, fallback to empty div
  const logoContent = logoBlock ? logoBlock : document.createElement('div');
  const navigationContent = navigationBlock ? navigationBlock : document.createElement('div');
  const searchContent = searchBlock ? searchBlock : document.createElement('div');

  // Build table rows
  // Header row: always one cell
  const headerRow = ['Columns (columns2)'];

  // Second row: logo | navigation | search
  const secondRow = [logoContent, navigationContent, searchContent];

  // Compose table
  const cells = [headerRow, secondRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
