/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Find the three main columns by class
  // 1. Logo/Image column
  const logoCol = grid.querySelector('.cmp-image--logo');
  // 2. Navigation column
  const navCol = grid.querySelector('.cmp-navigation--header');
  // 3. Search column
  const searchCol = grid.querySelector('.cmp-search--header');

  // Build columns array, include only present columns in the correct order
  const columns = [];
  if (logoCol) columns.push(logoCol);
  if (navCol) columns.push(navCol);
  if (searchCol) columns.push(searchCol);

  // There should be at least one column
  if (columns.length === 0) return;

  // Build the block table in the columns block style
  // The header row must be a single cell
  const headerRow = ['Columns (columns2)'];
  const tableRows = [headerRow, columns];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
