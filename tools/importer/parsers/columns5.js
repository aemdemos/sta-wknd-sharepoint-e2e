/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the columns
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get logo column (image)
  const logoCol = grid.querySelector('.image');
  let logoContent = null;
  if (logoCol) {
    const imgBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (imgBlock) logoContent = imgBlock;
  }

  // Get navigation column
  const navCol = grid.querySelector('.navigation');
  let navContent = null;
  if (navCol) {
    const navBlock = navCol.querySelector('nav');
    if (navBlock) navContent = navBlock;
  }

  // Get social column: title + buttons
  const titleCol = grid.querySelector('.title');
  let titleContent = null;
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title');
    if (titleBlock) titleContent = titleBlock;
  }

  const btnListCol = grid.querySelector('.cmp-buildingblock--btn-list');
  let btnListContent = null;
  if (btnListCol) {
    const btnGrid = btnListCol.querySelector('.aem-Grid');
    if (btnGrid) btnListContent = btnGrid;
  }

  // Compose social column: title + buttons
  let socialColContent = [];
  if (titleContent) socialColContent.push(titleContent);
  if (btnListContent) socialColContent.push(btnListContent);

  // Get text column (copyright and description)
  const textCol = grid.querySelector('.text');
  let textContent = null;
  if (textCol) {
    const textBlock = textCol.querySelector('.cmp-text');
    if (textBlock) textContent = textBlock;
  }

  // Compose columns row
  // If navigation is present, use 4 columns: logo, nav, social, text
  // If navigation is absent, use 3 columns: logo, social, text
  let columnsRow;
  if (navContent) {
    columnsRow = [logoContent, navContent, socialColContent, textContent];
  } else {
    columnsRow = [logoContent, socialColContent, textContent];
  }

  // Table header
  const headerRow = ['Columns (columns5)'];

  // Build table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
