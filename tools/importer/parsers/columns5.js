/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with expected content
  const aemGrids = element.querySelectorAll('.aem-Grid');
  let grid = null;
  for (let i = aemGrids.length - 1; i >= 0; i--) {
    const g = aemGrids[i];
    if (
      g.querySelector('.cmp-image') &&
      g.querySelector('.cmp-navigation') &&
      g.querySelector('.cmp-title') &&
      g.querySelector('.cmp-buildingblock--btn-list')
    ) {
      grid = g;
      break;
    }
  }
  if (!grid) {
    grid = aemGrids[aemGrids.length - 1];
  }

  // Extract columns in expected order
  let logoCol = grid.querySelector('.cmp-image') ? grid.querySelector('.cmp-image').parentElement : null;
  let navCol = grid.querySelector('.cmp-navigation') ? grid.querySelector('.cmp-navigation').parentElement : null;
  let titleCol = grid.querySelector('.cmp-title') ? grid.querySelector('.cmp-title').parentElement : null;
  let buttonsCol = null;
  let btnBlock = grid.querySelector('.cmp-buildingblock--btn-list');
  if (btnBlock) {
    // Prefer the child .aem-Grid if present
    let btnGrid = btnBlock.querySelector('.aem-Grid');
    buttonsCol = btnGrid || btnBlock;
  }

  // Columns for the row (may be missing some)
  const cols = [];
  if (logoCol) cols.push(logoCol);
  if (navCol) cols.push(navCol);
  if (titleCol) cols.push(titleCol);
  if (buttonsCol) cols.push(buttonsCol);

  // Copyright row (text block)
  const textCol = element.querySelector('.cmp-text');

  // Build rows: first row is header, single column; second is content columns; third is copyright row
  const rows = [];
  rows.push(['Columns (columns5)']);
  rows.push(cols);
  if (textCol) {
    // copyright row must have as many columns as content row, text in first cell, rest blank
    const cr = Array(cols.length).fill('');
    cr[0] = textCol;
    rows.push(cr);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
