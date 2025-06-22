/* global WebImporter */
export default function parse(element, { document }) {
  // Identify the two main columns: main and aside
  let mainColumn = null;
  let sideColumn = null;
  const directChildren = Array.from(element.children);
  for (const child of directChildren) {
    if (child.tagName.toLowerCase() === 'main' && !mainColumn) {
      mainColumn = child;
    }
    if (child.tagName.toLowerCase() === 'aside' && !sideColumn) {
      sideColumn = child;
    }
  }
  if (!mainColumn) mainColumn = element.querySelector('main');
  if (!sideColumn) sideColumn = element.querySelector('aside');

  // Header row must have exactly one column
  const headerRow = ['Columns (columns11)'];
  // Data row should have as many columns as present (in this case, 2)
  const dataRow = [[mainColumn, sideColumn]];

  // Since createTable expects all rows to have the same number of columns as the data row,
  // we need to pad the header row with empty strings so its length matches the data row.
  // But per the example, header row should be a single cell, so we should structure the table
  // as a single-column table where the second row contains a container div holding a columns layout.
  // However, for 'Columns' block, the classic representation is header (1 col), second row (n cols).

  // So, to match the example: create a table with 2 rows, first with 1 col, second with 2 cols
  // This requires passing a cells array like: [['Columns (columns11)'], [mainColumn, sideColumn]]

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [mainColumn, sideColumn],
  ], document);

  element.replaceWith(table);
}
