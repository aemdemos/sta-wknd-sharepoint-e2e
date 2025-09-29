/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the footer columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children).filter((col) => {
    const cls = col.className || '';
    return !cls.includes('separator') && !cls.includes('text');
  });

  // Compose the columns row: each cell is the main content block from the grid
  const columnsRow = columns.map((col) => {
    if (col.children.length === 1) {
      return col.firstElementChild;
    }
    return col;
  });

  // Find the text block for the copyright/info row
  const text = grid.querySelector('.text');
  let rows = [];
  const headerRow = ['Columns (columns5)'];
  rows.push(headerRow);
  rows.push(columnsRow);

  // Only add the copyright/info row if it exists, and do NOT pad with empty columns
  if (text) {
    // Use only the text content in a single cell row
    rows.push([text.firstElementChild || text]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
