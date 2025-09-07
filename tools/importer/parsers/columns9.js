/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid with the columns (logo, nav, follow/buttons)
  let grid;
  const gridCandidates = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  for (const candidate of gridCandidates) {
    if (
      candidate.querySelector('.cmp-image--logo') &&
      candidate.querySelector('.cmp-title--right')
    ) {
      grid = candidate;
      break;
    }
  }
  if (!grid) return;

  // Find columns
  const logoCol = grid.querySelector('.cmp-image--logo');
  const navCol = grid.querySelector('.cmp-navigation--footer');
  const followCol = grid.querySelector('.cmp-title--right');
  const btnListCol = grid.querySelector('.cmp-buildingblock--btn-list');

  // Get logo image block
  let logoBlock = null;
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // Get navigation block
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
  }

  // Get follow title
  let followTitle = null;
  if (followCol) {
    followTitle = followCol.querySelector('.cmp-title');
  }

  // Get button list
  let btnList = null;
  if (btnListCol) {
    btnList = btnListCol.querySelector('.xf-master-building-block');
  }

  // Get copyright text
  const copyrightCol = element.querySelector('.cmp-text--font-xsmall');
  let copyrightBlock = null;
  if (copyrightCol) {
    copyrightBlock = copyrightCol.querySelector('.cmp-text');
  }

  // Compose follow block (title + buttons)
  let followBlock = [];
  if (followTitle) followBlock.push(followTitle);
  if (btnList) followBlock.push(btnList);

  // Compose columns row
  let columnsRow = [];
  if (logoBlock) columnsRow.push(logoBlock);
  if (navBlock) columnsRow.push(navBlock);
  if (followBlock.length > 0) columnsRow.push(followBlock);

  // If navigation is missing, remove the empty cell
  if (!navBlock && columnsRow.length === 3) {
    columnsRow.splice(1, 1);
  }

  // Compose copyright row
  let copyrightRow = [];
  if (copyrightBlock) {
    // copyrightRow should be a single cell containing all copyright content
    copyrightRow = [copyrightBlock];
  }

  // Build the table
  const headerRow = ['Columns (columns9)'];
  const rows = [headerRow, columnsRow];
  if (copyrightRow.length) {
    rows.push(copyrightRow);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
