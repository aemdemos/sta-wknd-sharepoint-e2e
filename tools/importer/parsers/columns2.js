/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the grid container (should be unique per block)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo, navigation, search
  // Defensive: Only immediate children of grid
  const columns = Array.from(grid.children);

  // Find the logo/image column
  const logoCol = columns.find(col => col.classList.contains('image'));
  // Find the navigation column (may be missing)
  const navCol = columns.find(col => col.classList.contains('navigation'));
  // Find the search column
  const searchCol = columns.find(col => col.classList.contains('search'));

  // Defensive: Get the actual content elements for each column
  let logoContent = logoCol ? logoCol.querySelector('[data-cmp-is="image"]') : null;
  let navContent = navCol ? navCol.querySelector('nav') : null;
  let searchContent = searchCol ? searchCol.querySelector('section') : null;

  // Compose the columns for the block row
  // Always: logo | navigation (may be null) | search
  // If navigation is missing, only two columns
  const rowCells = [];
  if (logoContent) rowCells.push(logoContent);
  if (navContent) rowCells.push(navContent);
  if (searchContent) rowCells.push(searchContent);

  // If navigation is missing, keep only logo and search
  if (!navContent && rowCells.length === 3) {
    // Remove the middle cell (should not happen, but just in case)
    rowCells.splice(1, 1);
  }

  // Table header
  const headerRow = ['Columns (columns2)'];
  const tableRows = [headerRow, rowCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
