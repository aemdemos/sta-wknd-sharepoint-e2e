/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Prepare the header row
  const headerRow = ['Columns (columns2)'];

  // Prepare the content row
  const contentRow = columns.map((col) => col);

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
