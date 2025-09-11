/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid inside the element
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Defensive: find the logo image block
  const logoCol = columns.find(col => col.classList.contains('image'));
  let logoBlock = null;
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // Defensive: find the navigation block
  const navCol = columns.find(col => col.classList.contains('navigation'));
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
  }

  // Defensive: find the title block ("Follow Us")
  const titleCol = columns.find(col => col.classList.contains('title'));
  let titleBlock = null;
  if (titleCol) {
    titleBlock = titleCol.querySelector('.cmp-title');
  }

  // Defensive: find the social buttons block
  const btnListCol = columns.find(col => col.classList.contains('cmp-buildingblock--btn-list'));
  let btnListBlock = null;
  if (btnListCol) {
    btnListBlock = btnListCol.querySelector('.aem-Grid');
  }

  // Defensive: find the copyright text block (last column)
  const textCol = columns.find(col => col.classList.contains('text'));
  let textBlock = null;
  if (textCol) {
    textBlock = textCol.querySelector('.cmp-text');
  }

  // Compose the "Follow Us" column
  let followUsCol = null;
  if (titleBlock || btnListBlock) {
    followUsCol = document.createElement('div');
    if (titleBlock) followUsCol.appendChild(titleBlock.cloneNode(true));
    if (btnListBlock) followUsCol.appendChild(btnListBlock.cloneNode(true));
  }

  // Compose the columns array
  const cols = [];
  if (logoBlock) cols.push(logoBlock.cloneNode(true));
  if (navBlock) cols.push(navBlock.cloneNode(true));
  if (followUsCol) cols.push(followUsCol);
  if (textBlock) cols.push(textBlock.cloneNode(true));

  // Defensive: If no columns found, do nothing
  if (cols.length === 0) return;

  // Build the table rows
  const headerRow = ['Columns (columns5)'];
  const contentRow = cols;

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Actually replace the grid, not the outer element, to ensure DOM is modified
  grid.replaceWith(block);
}
