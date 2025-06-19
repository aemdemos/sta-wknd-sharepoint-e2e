/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article column (8 columns)
  const mainCol = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  // Find the sidebar (3 columns)
  const sideCol = element.querySelector('aside.container.responsivegrid.cmp-layoutcontainer--sidebar');

  // Helper to extract the content of a column as an array of elements
  function extractColumnContent(col) {
    if (!col) return [];
    const container = col.querySelector(':scope > div.cmp-container');
    if (container) {
      return Array.from(container.children);
    } else {
      return Array.from(col.children);
    }
  }

  const mainCell = extractColumnContent(mainCol);
  const sideCell = extractColumnContent(sideCol);

  // Put both columns' content in an array (to be used as a single table cell)
  const columnsContent = [
    ...mainCell,
    ...sideCell
  ];

  // Build the table: single header cell, single content cell
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns38)'],
    [columnsContent],
  ], document);

  element.replaceWith(table);
}
