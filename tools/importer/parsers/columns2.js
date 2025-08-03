/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // The header row for the block: single cell only
  const headerRow = ['Columns (columns2)'];

  // Get the three main column sections: logo, navigation, search
  // They are always in the same order: image, navigation, search
  const columns = Array.from(grid.children);

  // Defensive: filter columns for logo, nav, and search class
  const logoCol = columns.find(div => div.classList.contains('cmp-image--logo'));
  const navCol = columns.find(div => div.classList.contains('cmp-navigation--header'));
  const searchCol = columns.find(div => div.classList.contains('cmp-search--header'));

  // For each, pull the main content block for the table cell.
  // For logo: take the .cmp-image div inside
  let logoContent = logoCol ? logoCol.querySelector('.cmp-image') : null;
  // For navigation: take the nav.cmp-navigation element inside
  let navContent = navCol ? navCol.querySelector('nav.cmp-navigation') : null;
  // For search: take the section.cmp-search element inside
  let searchContent = searchCol ? searchCol.querySelector('section.cmp-search') : null;

  // Compose the cells for the columns row
  const columnsRow = [logoContent, navContent, searchContent];

  // Table structure: header is single cell; columns row is array of cells
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  
  element.replaceWith(block);
}
