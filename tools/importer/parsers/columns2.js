/* global WebImporter */
export default function parse(element, { document }) {
  // Find the immediate .aem-Grid within this block
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three columns: logo/image, navigation, search
  const columns = [];

  // 1. Logo/Image Column
  const logoCol = grid.querySelector('.cmp-image--logo');
  let logoBlock = '';
  if (logoCol) {
    logoBlock = logoCol.querySelector('[data-cmp-is="image"]') || '';
  }
  columns.push(logoBlock);

  // 2. Navigation column
  const navCol = grid.querySelector('.cmp-navigation--header');
  let navBlock = '';
  if (navCol) {
    navBlock = navCol.querySelector('nav.cmp-navigation') || '';
  }
  columns.push(navBlock);

  // 3. Search column
  const searchCol = grid.querySelector('.cmp-search--header');
  let searchBlock = '';
  if (searchCol) {
    searchBlock = searchCol.querySelector('.cmp-search') || '';
  }
  columns.push(searchBlock);

  // Table must have a header row with one cell, and then a content row with three cells (columns)
  const headerRow = ['Columns (columns2)'];
  const contentRow = columns;
  const tableRows = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
