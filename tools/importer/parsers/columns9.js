/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find content columns
  let logoCol = Array.from(grid.children).find(col => col.querySelector('.cmp-image'));
  let navCol = Array.from(grid.children).find(col => col.querySelector('.cmp-navigation'));
  let titleCol = Array.from(grid.children).find(col => col.querySelector('.cmp-title'));
  let btnCol = Array.from(grid.children).find(col => col.querySelector('.cmp-buildingblock--btn-list') || col.querySelector('.xf-master-building-block'));
  let textCol = Array.from(grid.children).find(col => col.querySelector('.cmp-text'));

  // Compose cells for main row
  const leftCell = [];
  if (logoCol) leftCell.push(logoCol);
  if (navCol) leftCell.push(navCol);
  const centerCell = [];
  if (titleCol) centerCell.push(titleCol);
  if (btnCol) centerCell.push(btnCol);
  const rightCell = [];
  if (textCol) rightCell.push(textCol);

  // Create the table
  // Header must be a single column, then a row with three columns
  const cells = [
    ['Columns (columns9)'],
    [leftCell, centerCell, rightCell]
  ];

  // Create table and fix header colspans
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Fix the <th> to span all columns if more than one column in second row
  const headerTr = table.querySelector('tr');
  if (headerTr && headerTr.children.length === 1 && table.rows.length > 1) {
    headerTr.children[0].setAttribute('colspan', table.rows[1].cells.length);
  }

  element.replaceWith(table);
}
