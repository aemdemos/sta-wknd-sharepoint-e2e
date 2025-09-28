/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children of the grid
  function getGridChildren(el) {
    // Find the .aem-Grid inside the element
    const grid = el.querySelector('.aem-Grid');
    if (!grid) return [];
    // Get all direct children of the grid
    return Array.from(grid.children);
  }

  // Find the grid children (logo, nav, search)
  const gridChildren = getGridChildren(element);

  // Defensive: fallback if not found
  if (gridChildren.length === 0) {
    // fallback: just replace with block header
    const block = WebImporter.DOMUtils.createTable([
      ['Columns (columns2)'],
      ['']
    ], document);
    element.replaceWith(block);
    return;
  }

  // Find logo/image column
  const logoCol = gridChildren.find(child => child.classList.contains('image'));
  // Find navigation column
  const navCol = gridChildren.find(child => child.classList.contains('navigation'));
  // Find search column
  const searchCol = gridChildren.find(child => child.classList.contains('search'));

  // Defensive: if any missing, treat as blank
  // Compose columns array
  const columns = [logoCol || '', navCol || '', searchCol || ''];

  // The header row
  const headerRow = ['Columns (columns2)'];

  // The columns row: each cell is the column's content
  // Use the direct child element for each column
  const contentRow = columns;

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
