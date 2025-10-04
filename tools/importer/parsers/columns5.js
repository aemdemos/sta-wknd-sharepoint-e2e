/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(`:scope > ${selector}`));
  }

  // Find the main grid (the layout container)
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all top-level columns in the grid
  const columns = getDirectChildren(grid, 'div');

  // Map columns by role
  let logoCol, navCol, followCol, socialCol;
  columns.forEach((col) => {
    if (col.classList.contains('image')) logoCol = col;
    else if (col.classList.contains('navigation')) navCol = col;
    else if (col.classList.contains('title')) followCol = col;
    else if (col.classList.contains('buildingblock')) socialCol = col;
  });

  // Find the two text blocks
  const textBlocks = Array.from(grid.querySelectorAll('.text .cmp-text'));

  // Compose the header row
  const headerRow = ['Columns (columns5)'];

  // Compose the second row: 4 columns
  // 1: Logo
  // 2: Navigation
  // 3: Follow Us + Social buttons
  // 4: Text blocks (footer text)

  // Cell 1: Logo (reference the element)
  const logoCell = logoCol || '';

  // Cell 2: Navigation (reference the element)
  const navCell = navCol || '';

  // Cell 3: Follow Us + Social buttons (reference both elements)
  const followCell = [];
  if (followCol) followCell.push(followCol);
  if (socialCol) followCell.push(socialCol);

  // Cell 4: Only text blocks (no <hr> separator)
  const textCell = [];
  textBlocks.forEach(tb => textCell.push(tb));

  // Compose the table rows
  const rows = [
    headerRow,
    [logoCell, navCell, followCell, textCell]
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
