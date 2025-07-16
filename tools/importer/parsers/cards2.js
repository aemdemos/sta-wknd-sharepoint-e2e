/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Header for the block
  const cells = [['Cards (cards2)']];

  // 1. Logo image
  const logoCol = grid.querySelector('.cmp-image--logo');
  let logoBlock = null;
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // 2. Navigation
  const navCol = grid.querySelector('.cmp-navigation--header');
  let navBlock = null;
  if (navCol) {
    navBlock = navCol.querySelector('nav');
  }

  // 3. Search
  const searchCol = grid.querySelector('.cmp-search--header');
  let searchBlock = null;
  if (searchCol) {
    searchBlock = searchCol.querySelector('section');
  }

  // Compose the row, only including existing elements
  const rowContent = [];
  if (logoBlock) rowContent.push(logoBlock);
  if (navBlock) rowContent.push(navBlock);
  if (searchBlock) rowContent.push(searchBlock);

  cells.push([rowContent]);

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}