/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container with columns
  let columnsRoot;
  const containers = element.querySelectorAll('.cmp-container');
  for (let i = containers.length - 1; i >= 0; i--) {
    const grid = containers[i].querySelector('.aem-Grid');
    if (grid) {
      columnsRoot = grid;
      break;
    }
  }
  if (!columnsRoot) {
    columnsRoot = element.querySelector('.aem-Grid');
  }
  if (!columnsRoot) {
    // If not found, fallback to whole element
    columnsRoot = element;
  }

  // Get all immediate child grid columns
  const gridChildren = Array.from(columnsRoot.children);

  // Extract the logo image column
  const logoCol = gridChildren.find(e => e.classList.contains('cmp-image--logo'));
  let logoBlock = null;
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
    // Defensive: If not found, use the logoCol itself
    if (!logoBlock) logoBlock = logoCol;
  }

  // Extract the navigation column
  const navCol = gridChildren.find(e => e.classList.contains('cmp-navigation--footer'));
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
    if (!navBlock) navBlock = navCol;
  }

  // Extract the follow us column (title)
  const followCol = gridChildren.find(e => e.classList.contains('cmp-title--right'));
  let followBlock = null;
  if (followCol) {
    followBlock = followCol.querySelector('.cmp-title');
    if (!followBlock) followBlock = followCol;
  }

  // Extract the social buttons column
  const btnCol = gridChildren.find(e => e.classList.contains('cmp-buildingblock--btn-list'));
  let btnBlock = null;
  if (btnCol) {
    // Use the div that holds all the buttons
    btnBlock = btnCol.querySelector('.aem-Grid') || btnCol;
  }

  // Compose the follow column: follow title + buttons
  const followCell = [];
  if (followBlock) followCell.push(followBlock);
  if (btnBlock) followCell.push(btnBlock);

  // Defensive: ensure always three columns in row
  const firstRow = [logoBlock, navBlock, followCell.length ? followCell : followBlock || btnBlock];

  // Extract the copyright text at bottom
  const textCol = gridChildren.find(e => e.classList.contains('cmp-text--font-xsmall'));
  let textBlock = null;
  if (textCol) {
    textBlock = textCol.querySelector('.cmp-text') || textCol;
  }

  // Table header must match the block name
  const headerRow = ['Columns (columns9)'];

  // Bottom row: single cell (not multiple columns)
  const bottomRow = [textBlock];

  // Build cells array
  const cells = [headerRow, firstRow, bottomRow];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
