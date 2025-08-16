/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid with the layout columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) return;

  // 1. Logo (image column)
  const logoCol = mainGrid.querySelector('.image.cmp-image--logo');
  const logoCell = logoCol || '';

  // 2. Navigation (middle column)
  const navCol = mainGrid.querySelector('.navigation.cmp-navigation--footer');
  const navCell = navCol || '';

  // 3. Follow Us title + Social (right column)
  const titleCol = mainGrid.querySelector('.title.cmp-title--right');
  const buildingBlockCol = mainGrid.querySelector('.buildingblock.cmp-buildingblock--btn-list');
  const followUsCell = [];
  if (titleCol) followUsCell.push(titleCol);
  if (buildingBlockCol) followUsCell.push(buildingBlockCol);

  // Compose the main columns row (must fill all columns)
  const columnsRow = [logoCell, navCell, followUsCell.length ? followUsCell : ''];

  // Copyright row is always 1st column, fill others with blank
  let copyrightRow = null;
  const textCol = mainGrid.querySelector('.text.cmp-text--font-xsmall');
  if (textCol) {
    copyrightRow = [textCol, '', ''];
  }

  // Compose table cells
  const cells = [
    ['Columns (columns9)'],
    columnsRow,
  ];
  if (copyrightRow) {
    cells.push(copyrightRow);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
