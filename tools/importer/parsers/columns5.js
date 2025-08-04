/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost aem-Grid with 12 columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Find the logo, navigation, and follow-us columns
  const logoCol = grid.querySelector('.image.cmp-image--logo');
  const navCol = grid.querySelector('.navigation.cmp-navigation--footer');
  const titleCol = grid.querySelector('.title.cmp-title--right');
  const btnsCol = grid.querySelector('.buildingblock.cmp-buildingblock--btn-list');
  const followCell = [];
  if (titleCol) {
    const titleDiv = titleCol.querySelector('.cmp-title') || titleCol;
    followCell.push(titleDiv);
  }
  if (btnsCol) {
    const btnsDiv = btnsCol.querySelector('.aem-Grid') || btnsCol;
    followCell.push(btnsDiv);
  }

  // Main row: 3 columns (logo, navigation, follow)
  const columnsRow = [
    logoCol || '',
    navCol || '',
    followCell.length ? followCell : ''
  ];

  // Text/Copyright row (single column)
  const textCol = grid.querySelector('.text.cmp-text--font-xsmall');
  const textRow = textCol ? [textCol] : null;

  // Table header: a single column with exactly the header name
  const cells = [
    ['Columns (columns5)'],
    columnsRow
  ];
  if (textRow) {
    cells.push(textRow);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
