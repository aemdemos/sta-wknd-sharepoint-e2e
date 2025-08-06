/* global WebImporter */
export default function parse(element, { document }) {
  // Find main content grid
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Find the logo image (left column)
  const logoCol = mainGrid.querySelector('.image.cmp-image--logo');
  let logoDiv = null;
  if (logoCol) {
    logoDiv = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // Find the navigation (middle column)
  const navCol = mainGrid.querySelector('.navigation.cmp-navigation--footer');
  let navElement = null;
  if (navCol) {
    navElement = navCol.querySelector('nav');
  }

  // Find the "Follow Us" title (right column, top)
  const titleCol = mainGrid.querySelector('.title.cmp-title--right');
  let titleDiv = null;
  if (titleCol) {
    titleDiv = titleCol.querySelector('.cmp-title');
  }

  // Find the social buttons (right column, below title)
  const btnBlockCol = mainGrid.querySelector('.buildingblock.cmp-buildingblock--btn-list');
  let btnBlockDiv = null;
  if (btnBlockCol) {
    btnBlockDiv = btnBlockCol.querySelector('.aem-Grid');
  }

  // Find the text block for the copyright (footer row)
  const textCol = mainGrid.querySelector('.text.cmp-text--font-xsmall');
  let textDiv = null;
  if (textCol) {
    textDiv = textCol.querySelector('.cmp-text');
  }

  // Compose the right column: title (if present) + button list (if present)
  const rightColContent = [];
  if (titleDiv) rightColContent.push(titleDiv);
  if (btnBlockDiv) rightColContent.push(btnBlockDiv);

  // Prepare the number of columns
  const colCount = 3;
  // Header row: one cell, to be expanded with empty cells to match colCount
  // WebImporter.DOMUtils.createTable will set colspan automatically for a single header cell
  const cells = [
    ['Columns (columns9)'],
    [logoDiv, navElement, rightColContent],
  ];
  // Copyright/info row: text in first cell, rest empty
  if (textDiv) {
    const copyrightRow = [textDiv];
    for (let i = 1; i < colCount; i++) copyrightRow.push('');
    cells.push(copyrightRow);
  }
  
  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
