/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid
  let grid;
  const grids = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element.querySelector('.aem-Grid');
  }
  if (!grid) grid = element;

  // Get all direct children of the grid
  const cols = Array.from(grid.children);

  // Group for left cell: logo and navigation
  const leftCellElements = [];
  const imageCol = cols.find(col => col.classList.contains('image'));
  if (imageCol) {
    const cmpImage = imageCol.querySelector('.cmp-image');
    if (cmpImage) leftCellElements.push(cmpImage);
  }
  const navCol = cols.find(col => col.classList.contains('navigation'));
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) leftCellElements.push(nav);
  }

  // Group for right cell: title, social buttons, copyright/info text
  const rightCellElements = [];
  const titleCol = cols.find(col => col.classList.contains('title'));
  if (titleCol) {
    const cmpTitle = titleCol.querySelector('.cmp-title');
    if (cmpTitle) rightCellElements.push(cmpTitle);
  }
  const btnCol = cols.find(col => col.classList.contains('cmp-buildingblock--btn-list'));
  if (btnCol) {
    const btnGrid = btnCol.querySelector('.aem-Grid');
    if (btnGrid) rightCellElements.push(btnGrid);
  }
  const textCol = cols.find(col => col.classList.contains('text'));
  if (textCol) {
    const cmpText = textCol.querySelector('.cmp-text');
    if (cmpText) rightCellElements.push(cmpText);
  }

  // Always make each cell as a single element or array (not spread out as separate columns)
  // This is the CRITICAL FIX: pass as two cells only
  const contentRow = [leftCellElements, rightCellElements];

  // Build the table block
  const cells = [
    ['Columns (columns9)'],
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
