/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row: single column with block name
  const headerRow = ['Columns (columns2)'];

  // Find the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get the three main columns: logo, navigation, search
  let logoCol = grid.querySelector('.image.cmp-image--logo') || '';
  let navCol = grid.querySelector('.navigation.cmp-navigation--header') || '';
  let searchCol = grid.querySelector('.search.cmp-search--header') || '';

  // Content row: an array with the three columns
  const contentRow = [logoCol, navCol, searchCol];

  // Prepare the table cells array: single header cell, then a row of N columns
  const cells = [
    headerRow, // 1 column
    contentRow // N columns (here, 3)
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
