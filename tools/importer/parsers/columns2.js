/* global WebImporter */
export default function parse(element, { document }) {
  // Find the direct .cmp-container child
  const container = element.querySelector('.cmp-container');
  if (!container) return;
  // Find the grid inside
  const grid = container.querySelector('.aem-Grid');
  if (!grid) return;
  // Get the three main columns: logo, navigation, search
  // These are .image (logo), .navigation, .search
  const gridChildren = Array.from(grid.querySelectorAll(':scope > div'));

  // Get references to each major component
  let logoCol, navCol, searchCol;
  gridChildren.forEach(child => {
    if (child.classList.contains('image')) {
      logoCol = child;
    } else if (child.classList.contains('navigation')) {
      navCol = child;
    } else if (child.classList.contains('search')) {
      searchCol = child;
    }
  });
  // Only include columns if present
  const columns = [logoCol, navCol, searchCol].filter(Boolean);
  // Header row per spec: single cell
  const headerRow = ['Columns (columns2)'];
  // Second row: one cell per column of content
  const contentRow = columns;
  // Structure: [[header], [col1, col2, col3]]
  const cells = [headerRow, contentRow];
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
