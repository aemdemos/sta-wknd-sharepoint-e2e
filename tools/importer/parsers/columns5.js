/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the actual footer content
  let grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Column 1: Logo
  const logoCol = columns.find(col => col.classList.contains('image'));
  let logoBlock = null;
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // Column 2: Navigation
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
  }

  // Column 3: Social (title + buttons)
  const titleCol = columns.find(col => col.classList.contains('title'));
  const btnListCol = columns.find(col => col.classList.contains('cmp-buildingblock--btn-list'));
  let socialBlock = [];
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title');
    if (titleBlock) socialBlock.push(titleBlock);
  }
  if (btnListCol) {
    const btnGrid = btnListCol.querySelector('.aem-Grid');
    if (btnGrid) {
      Array.from(btnGrid.children).forEach(btnCol => {
        const btn = btnCol.querySelector('a.cmp-button');
        if (btn) socialBlock.push(btn);
      });
    }
  }

  // Below columns: text blocks only (no separator/hr)
  const textCols = columns.filter(col => col.classList.contains('cmp-text--font-xsmall'));
  let textBlocks = [];
  textCols.forEach(tc => {
    const tb = tc.querySelector('.cmp-text');
    if (tb) textBlocks.push(tb);
  });

  // Compose table rows
  const headerRow = ['Columns (columns5)'];
  const contentRow = [
    logoBlock,
    navBlock,
    socialBlock
  ];

  // Only include as many columns in belowRow as there are text blocks (no unnecessary empty columns)
  const belowRow = textBlocks;

  const cells = [headerRow, contentRow];
  if (belowRow.length > 0) cells.push(belowRow);
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
