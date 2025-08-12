/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get each major section in the grid
  let logoCol = null;
  let navCol = null;
  let searchCol = null;
  Array.from(grid.children).forEach((child) => {
    if (child.classList.contains('image')) {
      logoCol = child;
    } else if (child.classList.contains('navigation')) {
      navCol = child;
    } else if (child.classList.contains('search')) {
      searchCol = child;
    }
  });

  // Compose columns. Only include those that exist (never create new elements)
  const contentColumns = [];
  if (logoCol) contentColumns.push(logoCol);
  if (navCol) contentColumns.push(navCol);
  if (searchCol) contentColumns.push(searchCol);

  // If there are less than 2 columns, pad with empty string for robustness
  while (contentColumns.length < 2) contentColumns.push('');

  // Header row: must be a single cell (not multiple columns)
  const headerRow = ['Columns (columns2)'];
  const tableRows = [headerRow, contentColumns];

  // Create the table and replace original element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
