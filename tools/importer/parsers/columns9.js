/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with the main footer columns
  const grids = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  if (!grids.length) return;
  // The correct grid is the last one (deepest, where columns are)
  const grid = grids[grids.length - 1];

  // Get immediate children of the grid for column content
  const children = Array.from(grid.children);
  // Columns are: logo, navigation, title, social buttons
  // Use class selectors to pick out columns
  function getCol(classNamePart) {
    return children.find(child => child.className.includes(classNamePart));
  }
  const logoCol = getCol('image');
  const navCol = getCol('navigation');
  const titleCol = getCol('title');
  const btnCol = getCol('buildingblock');

  // The order from the screenshots/HTML is: logo, nav, title, btns
  const columnsArr = [logoCol, navCol, titleCol, btnCol].filter(Boolean);
  if (!columnsArr.length) return;
  // The copyright/info text always appears in .text.cmp-text--font-xsmall
  const copyrightText = grid.querySelector('.text.cmp-text--font-xsmall');

  // Compose table as per instructions
  // Header row: must be a single cell
  const headerRow = ['Columns (columns9)'];
  const contentRow = columnsArr;
  const bodyRows = [];
  if (copyrightText) {
    // Copyright/info text should be in the first column, others empty
    const row = Array(columnsArr.length).fill('');
    row[0] = copyrightText;
    bodyRows.push(row);
  }

  // The cells array must have a single-cell header row, then full columns (second row), then copyright/info row
  const cells = [headerRow, contentRow, ...bodyRows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
