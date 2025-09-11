/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // For this header block, we want 3 columns:
  // 1. Logo (image)
  // 2. Navigation (may be empty)
  // 3. Search

  // Defensive: find by known classes
  const logoCol = columns.find(col => col.classList.contains('image'));
  const navCol = columns.find(col => col.classList.contains('navigation'));
  const searchCol = columns.find(col => col.classList.contains('search'));

  // Defensive: fallback to empty div if not found
  const logoContent = logoCol ? logoCol : document.createElement('div');
  const navContent = navCol ? navCol : document.createElement('div');
  const searchContent = searchCol ? searchCol : document.createElement('div');

  // Compose the table
  const headerRow = ['Columns (columns2)'];
  const contentRow = [logoContent, navContent, searchContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
