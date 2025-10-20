/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the actual footer columns
  let grid;
  const grids = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children).filter((col) => {
    if (col.querySelector('.cmp-separator')) return false;
    if (col.classList.contains('cmp-separator')) return false;
    if (!col.textContent.trim() && !col.querySelector('img')) return false;
    return true;
  });

  // 1. Logo
  const logoCol = columns.find((col) => col.querySelector('.cmp-image'));
  // 2. Navigation
  const navCol = columns.find((col) => col.querySelector('.cmp-navigation'));
  // 3. Follow Us title and social buttons (should be grouped together)
  const followTitleCol = columns.find((col) => col.querySelector('.cmp-title'));
  const socialCol = columns.find((col) => col.querySelector('.cmp-buildingblock--btn-list'));
  // 4. Text columns (there may be two stacked)
  const textCols = columns.filter((col) => col.querySelector('.cmp-text'));

  // Compose the third column: followTitle + social buttons (grouped together)
  let followUsCell = document.createElement('div');
  if (followTitleCol) {
    const title = followTitleCol.querySelector('.cmp-title');
    if (title) followUsCell.appendChild(title.cloneNode(true));
  }
  if (socialCol) {
    const btnGrid = socialCol.querySelector('.aem-Grid');
    if (btnGrid) followUsCell.appendChild(btnGrid.cloneNode(true));
  }

  // Compose the fourth column: all text blocks
  let textCell = document.createElement('div');
  textCols.forEach((col) => {
    const txt = col.querySelector('.cmp-text');
    if (txt) textCell.appendChild(txt.cloneNode(true));
  });

  // Compose the cells for the columns block
  const headerRow = ['Columns (columns4)'];
  const contentRow = [
    logoCol ? logoCol.querySelector('.cmp-image') : '',
    navCol ? navCol.querySelector('.cmp-navigation') : '',
    followUsCell,
    textCell
  ];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
