/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the footer content
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // --- COLUMN 1: Logo ---
  const logoBlock = grid.querySelector('.image');
  let logoContent = null;
  if (logoBlock) {
    logoContent = logoBlock;
  }

  // --- COLUMN 2: Navigation ---
  const navBlock = grid.querySelector('.navigation');
  let navContent = null;
  if (navBlock) {
    navContent = navBlock;
  }

  // --- COLUMN 3: Follow Us title + Social Buttons ---
  const titleBlock = grid.querySelector('.title');
  const btnListBlock = grid.querySelector('.cmp-buildingblock--btn-list');
  let col3Content = null;
  if (titleBlock || btnListBlock) {
    col3Content = document.createElement('div');
    if (titleBlock) col3Content.appendChild(titleBlock);
    if (btnListBlock) col3Content.appendChild(btnListBlock);
  }

  // --- COLUMN 4: Footer Text ---
  const textBlocks = Array.from(grid.querySelectorAll('.cmp-text'));
  let textContent = null;
  if (textBlocks.length) {
    textContent = document.createElement('div');
    textBlocks.forEach(tb => textContent.appendChild(tb));
  }

  // --- Build the table ---
  const headerRow = ['Columns (columns5)'];
  const columnsRow = [logoContent, navContent, col3Content, textContent];
  const tableRows = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
