/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost .aem-Grid with the footer content
  let grid = element.querySelector('.cmp-layoutcontainer--footer .aem-Grid');
  if (!grid) {
    const grids = element.querySelectorAll('.aem-Grid');
    grid = grids[grids.length - 1];
  }

  // Collect columns: get all direct children that are actual columns, not separators or .cmp-text
  const columns = [];
  if (grid) {
    const gridChildren = Array.from(grid.children).filter(
      (child) => child.classList && child.classList.contains('aem-GridColumn')
    );
    for (const child of gridChildren) {
      if (child.classList.contains('cmp-separator--hidden')) continue;
      if (child.querySelector('.cmp-text')) continue;
      columns.push(child);
    }
  }

  // Find copyright/info text (the .cmp-text)
  const textRow = element.querySelector('.cmp-text');

  // Build cells array with single header column as first row
  const cells = [];
  // Header row: single column
  cells.push(['Columns (columns9)']);
  // Content columns row, as many columns as needed
  if (columns.length > 0) {
    cells.push(columns);
  }
  // Add copyright/info row as a single cell in the first column, remaining columns are empty strings
  if (textRow) {
    const infoRow = [textRow];
    for (let i = 1; i < columns.length; i++) {
      infoRow.push('');
    }
    cells.push(infoRow);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
