/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid with the columns
  function findColumnsGrid(el) {
    const grids = el.querySelectorAll('.aem-Grid');
    let deepest = null;
    grids.forEach((grid) => {
      if (grid.querySelector('.image') && grid.querySelector('.navigation')) {
        deepest = grid;
      }
    });
    return deepest;
  }

  const grid = findColumnsGrid(element);
  if (!grid) {
    const block = WebImporter.DOMUtils.createTable([
      ['Columns (columns11)'],
    ], document);
    element.replaceWith(block);
    return;
  }

  // Get the four columns: logo, navigation, follow us, social buttons
  const colClasses = ['.image', '.navigation', '.title', '.buildingblock'];
  const columns = colClasses.map(sel => grid.querySelector(sel)).filter(Boolean);
  const colCount = columns.length;

  // Get all .separator and .text (full width) blocks in visual order
  const fullWidthRows = Array.from(grid.children).filter(
    c => c.classList.contains('separator') || c.classList.contains('text')
  );

  // Remove <hr> from fullWidthRows unless a Section Metadata table is present (not needed here)
  fullWidthRows.forEach(cell => {
    if (cell && cell.tagName === 'DIV' && cell.querySelector('hr')) {
      const hr = cell.querySelector('hr');
      if (hr) hr.remove();
    }
  });

  // Build table rows
  const headerRow = ['Columns (columns11)'];
  const contentRow = columns;
  const rows = [headerRow, contentRow];

  // For each fullWidthRow, distribute content across all columns
  // If there are N fullWidthRows and M columns, distribute in order
  // If fewer fullWidthRows than columns, fill left to right
  // If more, fill in additional rows as needed
  let fwIndex = 0;
  while (fwIndex < fullWidthRows.length) {
    const row = [];
    for (let i = 0; i < colCount; i++) {
      if (fwIndex < fullWidthRows.length) {
        row.push(fullWidthRows[fwIndex]);
        fwIndex++;
      } else {
        row.push('');
      }
    }
    rows.push(row);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
