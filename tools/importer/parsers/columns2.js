/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be a single cell, matching the block name exactly
  const headerRow = ['Columns (columns2)'];

  // Find the grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Collect the main content for each column
  const possibleSelectors = ['.cmp-image', '.cmp-navigation', '.cmp-search'];
  const columnCells = [];
  Array.from(grid.children).forEach((col) => {
    for (const sel of possibleSelectors) {
      const block = col.querySelector(sel);
      if (block) {
        columnCells.push(block);
        break; // Only include the first found block for this column
      }
    }
  });

  if (columnCells.length < 1) return;

  // Compose the table: header row is a single cell, content row has N columns
  const cells = [
    headerRow,
    columnCells,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
