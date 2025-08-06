/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains the actual header content
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the three main content columns: logo, navigation, search
  const columns = [];

  // logo column: .cmp-image--logo
  const logoCol = grid.querySelector('.cmp-image--logo');
  let logoContent = null;
  if (logoCol) {
    const logoBlock = logoCol.querySelector('div[data-cmp-is="image"]');
    if (logoBlock) logoContent = logoBlock;
  }

  // navigation column: .cmp-navigation--header
  const navCol = grid.querySelector('.cmp-navigation--header');
  let navContent = null;
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navContent = nav;
  }

  // search column: .cmp-search--header
  const searchCol = grid.querySelector('.cmp-search--header');
  let searchContent = null;
  if (searchCol) {
    const search = searchCol.querySelector('section');
    if (search) searchContent = search;
  }

  // Add the columns in the correct order, only if present
  if (logoContent) columns.push(logoContent);
  if (navContent) columns.push(navContent);
  if (searchContent) columns.push(searchContent);
  if (columns.length === 0) return;

  // The header row must be a single column (spanning all), not one per cell
  const headerRow = ['Columns (columns2)'];
  const cells = [headerRow, columns];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
