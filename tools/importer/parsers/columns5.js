/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest main grid for the footer columns
  const mainGrid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!mainGrid) return;

  // Find relevant column children by their unique classes
  let logoCol = null, navCol = null, titleCol = null, socialCol = null, copyrightCol = null;
  Array.from(mainGrid.children).forEach(child => {
    if (child.classList.contains('cmp-image--logo')) logoCol = child;
    else if (child.classList.contains('cmp-navigation--footer')) navCol = child;
    else if (child.classList.contains('cmp-title--right')) titleCol = child;
    else if (child.classList.contains('cmp-buildingblock--btn-list')) socialCol = child;
    else if (child.classList.contains('cmp-text--font-xsmall')) copyrightCol = child;
  });

  // Defensive: If copyright is not found, try fallback
  if (!copyrightCol) {
    copyrightCol = element.querySelector('.cmp-text--font-xsmall');
  }
  if (!logoCol) {
    logoCol = element.querySelector('.cmp-image--logo');
  }
  if (!navCol) {
    navCol = element.querySelector('.cmp-navigation--footer');
  }
  if (!titleCol) {
    titleCol = element.querySelector('.cmp-title--right');
  }
  if (!socialCol) {
    socialCol = element.querySelector('.cmp-buildingblock--btn-list');
  }

  // Compose social block: title + buttons in a wrapper div
  const socialCell = document.createElement('div');
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title');
    if (titleBlock) socialCell.appendChild(titleBlock);
  }
  if (socialCol) {
    const socialGrid = socialCol.querySelector('.aem-Grid');
    if (socialGrid) socialCell.appendChild(socialGrid);
  }

  // Compose copyright cell, reference only the inner cmp-text if present
  let copyrightBlock = null;
  if (copyrightCol) {
    copyrightBlock = copyrightCol.querySelector('.cmp-text') || copyrightCol;
  }

  // Build block table
  // The header must be exactly one column, matching the example
  const headerRow = ['Columns (columns5)'];
  // Content row: three columns
  const contentRow = [logoCol, navCol, socialCell];
  // Copyright row: three columns, only first is content
  const copyrightRow = [copyrightBlock, '', ''];

  const cells = [headerRow, contentRow, copyrightRow];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
