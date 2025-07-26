/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the .cmp-teaser__content and .cmp-teaser__image elements
  const content = element.querySelector('.cmp-teaser__content');
  const image = element.querySelector('.cmp-teaser__image');

  // Defensive: handle missing columns
  const col1 = content ? content : '';
  const col2 = image ? image : '';

  // Header row: single cell, per requirement
  const headerRow = ['Columns (columns40)'];
  // Content row: two columns
  const contentRow = [col1, col2];

  // Create the table data: first row is header (single cell), then content row (two cells)
  const tableData = [headerRow, contentRow];

  // Create table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // For a single-cell header spanning two columns, set colspan on the first row
  const theadRow = table.querySelector('tr');
  if (theadRow && theadRow.children.length === 1) {
    theadRow.children[0].setAttribute('colspan', '2');
  }
  
  element.replaceWith(table);
}
