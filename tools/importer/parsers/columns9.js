/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only operate if element is the main container
  if (!element || !document) return;

  // Find the main grid wrapper
  const grid = element.querySelector(':scope > div.cmp-container > div.aem-Grid');
  if (!grid) return;

  // Find the main content column (default--8)
  const mainCol = grid.querySelector('.aem-GridColumn.aem-GridColumn--default--8');
  // Find the sidebar column (default--3)
  const sidebarCol = grid.querySelector('.aem-GridColumn.aem-GridColumn--default--3');

  // Defensive: If not found, fallback to first/second columns
  const columns = [];
  if (mainCol) columns.push(mainCol);
  if (sidebarCol) columns.push(sidebarCol);

  // If columns not found, fallback to all direct children
  if (columns.length < 2) {
    const allCols = Array.from(grid.querySelectorAll(':scope > .aem-GridColumn'));
    if (allCols.length >= 2) {
      columns.length = 0;
      columns.push(allCols[0], allCols[1]);
    }
  }

  // If still not found, abort
  if (columns.length < 2) return;

  // Table header row
  const headerRow = ['Columns (columns9)'];

  // Table content row: each cell is the entire column content
  // Use the first child of each column (the cmp-container)
  const contentRow = columns.map((col) => {
    // Find the cmp-container inside the column
    const container = col.querySelector(':scope > .cmp-container') || col;
    // Remove any <hr> elements that are not inside a Section Metadata table
    Array.from(container.querySelectorAll('hr')).forEach(hr => {
      // Only remove <hr> if not inside a table
      if (!hr.closest('table')) {
        hr.remove();
      }
    });
    return container;
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
