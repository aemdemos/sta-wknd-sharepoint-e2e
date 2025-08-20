/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class match
  function getGridCol(grid, classMatch) {
    return Array.from(grid.querySelectorAll(':scope > div')).find(div => div.className.includes(classMatch));
  }

  // Find the grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get three columns: logo, navigation, search
  const logoCol = getGridCol(grid, 'cmp-image--logo');
  const navCol = getGridCol(grid, 'cmp-navigation--header');
  const searchCol = getGridCol(grid, 'cmp-search--header');

  // Reference the relevant content blocks
  const logoBlock = logoCol ? logoCol.firstElementChild : '';
  const navBlock = navCol ? navCol.firstElementChild : '';
  const searchBlock = searchCol ? searchCol.firstElementChild : '';

  // Build the table: header (single cell), one row with three columns
  const headerRow = ['Columns (columns2)'];
  const contentRow = [logoBlock, navBlock, searchBlock];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
