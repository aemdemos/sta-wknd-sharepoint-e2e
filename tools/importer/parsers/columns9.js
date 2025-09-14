/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid containing the columns
  const grids = element.querySelectorAll('.aem-Grid');
  const grid = grids.length ? grids[grids.length - 1] : element;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // Compose left column: logo, nav, copyright text
  const leftColContent = [];
  // Logo
  const logoCol = columns.find(col => col.classList.contains('image'));
  if (logoCol) {
    const logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoBlock) leftColContent.push(logoBlock.cloneNode(true));
  }
  // Navigation
  const navCol = columns.find(col => col.classList.contains('navigation'));
  if (navCol) {
    const navBlock = navCol.querySelector('nav');
    if (navBlock) leftColContent.push(navBlock.cloneNode(true));
  }
  // Copyright text
  const textCol = columns.find(col => col.classList.contains('text'));
  if (textCol) {
    const textBlock = textCol.querySelector('.cmp-text');
    if (textBlock) leftColContent.push(textBlock.cloneNode(true));
  }

  // Compose right column: follow us title, social buttons
  const rightColContent = [];
  // Title
  const titleCol = columns.find(col => col.classList.contains('title'));
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title');
    if (titleBlock) rightColContent.push(titleBlock.cloneNode(true));
  }
  // Social buttons
  const btnCol = columns.find(col => col.classList.contains('buildingblock'));
  if (btnCol) {
    // Instead of just the grid, include all button links
    const btnLinks = btnCol.querySelectorAll('a.cmp-button');
    btnLinks.forEach(btn => rightColContent.push(btn.cloneNode(true)));
  }

  // If both columns are empty, do not add a body row
  if (!leftColContent.length && !rightColContent.length) {
    const block = WebImporter.DOMUtils.createTable([['Columns (columns9)']], document);
    element.replaceWith(block);
    return;
  }

  // Table header row
  const headerRow = ['Columns (columns9)'];
  // Table body row (each row is an array of columns)
  const bodyRow = [
    leftColContent.length ? (leftColContent.length === 1 ? leftColContent[0] : leftColContent) : '',
    rightColContent.length ? (rightColContent.length === 1 ? rightColContent[0] : rightColContent) : ''
  ];
  const cells = [headerRow, bodyRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
