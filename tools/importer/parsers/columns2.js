/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid which contains the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Extract the three main columns: logo, navigation, search
  const logoCol = grid.querySelector('.image') || document.createTextNode('');
  const navCol = grid.querySelector('.navigation') || document.createTextNode('');
  const searchCol = grid.querySelector('.search') || document.createTextNode('');

  // Header row must be a single-column array
  const headerRow = ['Columns (columns2)'];
  // Content row: one cell per column
  const contentRow = [logoCol, navCol, searchCol];

  // Compose the table
  const cells = [
    headerRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
