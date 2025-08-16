/* global WebImporter */
export default function parse(element, { document }) {
  // Find the aem-Grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Get top-level columns inside the grid
  const columns = Array.from(grid.children);

  // Find logo (image), navigation, search columns by their class
  let logoCol = columns.find(col => col.classList.contains('image'));
  let navCol = columns.find(col => col.classList.contains('navigation'));
  let searchCol = columns.find(col => col.classList.contains('search'));

  // Provided HTML always has these columns; filter out missing ones for safety
  const contentRow = [logoCol, navCol, searchCol].filter(Boolean);
  if (contentRow.length === 0) return;

  // Build cells for Columns block
  // The header row must be a single cell, not one per column
  const headerRow = ['Columns (columns2)'];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
