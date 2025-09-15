/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the deepest grid containing the footer content
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children).filter(child => {
    // Filter out separators (hr) and empty containers
    if (child.classList.contains('separator') || child.classList.contains('cmp-separator')) return false;
    // Defensive: skip empty containers
    if (child.childElementCount === 0 && child.textContent.trim() === '') return false;
    return true;
  });

  // Compose the cells for the columns row
  const contentRow = columns.map(col => {
    // For each column, find the main content element
    // If the column is a wrapper (like .image, .navigation, .title, .buildingblock, .text),
    // use its first child if it only has one, otherwise use the column itself
    if (col.childElementCount === 1) {
      return col.firstElementChild;
    }
    return col;
  });

  // Table header as specified
  const headerRow = ['Columns (columns5)'];
  const tableRows = [headerRow, contentRow];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
