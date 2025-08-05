/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .aem-Grid - the main content grid for the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all immediate children of the grid, representing the columns
  const columns = Array.from(grid.children);

  // The columns we care about: logo (image), navigation, and search
  const logoCol = columns.find(col => col.classList.contains('cmp-image--logo')) || '';
  const navCol = columns.find(col => col.classList.contains('cmp-navigation--header')) || '';
  const searchCol = columns.find(col => col.classList.contains('cmp-search--header')) || '';

  // Header row must be a single cell spanning all columns
  const headerRow = ['Columns (columns2)'];
  // Second row: the three columns, in the order logo, nav, search
  const dataRow = [logoCol, navCol, searchCol];

  // Compose the table: headerRow as a single cell, dataRow as column cells
  const table = WebImporter.DOMUtils.createTable([
    headerRow, // single header cell as array of length 1
    dataRow    // array with as many columns as needed
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
