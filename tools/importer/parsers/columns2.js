/* global WebImporter */
export default function parse(element, { document }) {
  // Find the primary grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct grid columns
  const gridColumns = Array.from(grid.children);

  // Find logo image, navigation, and search columns
  let logoCol = gridColumns.find(col => col.classList.contains('image'));
  let navCol = gridColumns.find(col => col.classList.contains('navigation'));
  let searchCol = gridColumns.find(col => col.classList.contains('search'));

  // Reference the block containers directly
  const logoBlock = logoCol ? logoCol.querySelector('.cmp-image') : null;
  const navBlock = navCol ? navCol.querySelector('nav') : null;
  const searchBlock = searchCol ? searchCol.querySelector('section.cmp-search') : null;

  // Compose the table with a single-cell header row, and then a content row with up to three columns
  const headerRow = ['Columns (columns2)'];
  const contentRow = [];
  if (logoBlock) contentRow.push(logoBlock);
  if (navBlock) contentRow.push(navBlock);
  if (searchBlock) contentRow.push(searchBlock);

  // Only proceed if we have at least one column
  if (contentRow.length === 0) return;

  // Create the table: first row (header) is 1 column, second row is N columns
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the element
  element.replaceWith(table);
}
