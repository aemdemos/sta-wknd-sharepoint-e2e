/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Identify the columns by class
  const logoCol = columns.find((col) => col.classList.contains('cmp-image--logo'));
  const navCol = columns.find((col) => col.classList.contains('cmp-navigation--header'));
  const searchCol = columns.find((col) => col.classList.contains('cmp-search--header'));

  // Clone nodes to avoid moving them in the DOM prematurely
  const cloneOrEmpty = (col) => (col ? col.cloneNode(true) : '');

  // Build the row in the correct order (logo, nav, search)
  const contentRow = [cloneOrEmpty(logoCol), cloneOrEmpty(navCol), cloneOrEmpty(searchCol)];

  // Remove empty trailing columns
  let lastNonEmpty = contentRow.length - 1;
  while (lastNonEmpty > 0 && !contentRow[lastNonEmpty]) lastNonEmpty--;
  const trimmedRow = contentRow.slice(0, lastNonEmpty + 1);

  // Always use the required header row
  const headerRow = ['Columns (columns2)'];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    trimmedRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
