/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the grid container (usually only one direct child)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Prepare the header row
  const headerRow = ['Columns (columns2)'];

  // Prepare the content row
  // We want one cell per visual column: logo, navigation, search
  // Defensive: find the image/logo, navigation, and search blocks
  let logoCol = null;
  let navCol = null;
  let searchCol = null;

  columns.forEach((col) => {
    if (col.classList.contains('image')) {
      logoCol = col;
    } else if (col.classList.contains('navigation')) {
      navCol = col;
    } else if (col.classList.contains('search')) {
      searchCol = col;
    }
  });

  // Build the row: always 3 columns (logo, nav, search)
  // If any are missing, use an empty string for that cell
  const row = [logoCol || '', navCol || '', searchCol || ''];

  // Build the table
  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
