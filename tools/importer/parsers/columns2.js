/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Each direct child of grid is a visual column
  const columns = Array.from(grid.children);

  // For each column, extract the main content element (usually the first child)
  const columnContents = columns.map((col) => {
    // Defensive: If column has only one element child, use it; else, use the column itself
    const children = Array.from(col.children).filter((c) => c.nodeType === 1);
    if (children.length === 1) {
      return children[0];
    }
    return col;
  });

  // Table header must match block name exactly
  const headerRow = ['Columns (columns2)'];

  // Table row: each cell is a column's content element (reference, not clone)
  const contentRow = columnContents;

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
