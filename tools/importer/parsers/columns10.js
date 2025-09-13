/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid containing the columns
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Extract columns: logo, navigation, follow us, social buttons
  const columns = [];

  // 1. Logo column (image)
  const logoCol = grid.querySelector('.image');
  if (logoCol) columns.push(logoCol);

  // 2. Navigation column
  const navCol = grid.querySelector('.navigation');
  if (navCol) columns.push(navCol);

  // 3. Follow Us title and social buttons (should be grouped in one column visually)
  const followCol = document.createElement('div');
  followCol.style.display = 'contents';
  const titleCol = grid.querySelector('.title');
  if (titleCol) followCol.appendChild(titleCol);
  const btnCol = grid.querySelector('.buildingblock');
  if (btnCol) followCol.appendChild(btnCol);
  if (followCol.childNodes.length > 0) columns.push(followCol);

  // Compose the header row and content row
  const headerRow = ['Columns (columns10)'];
  const contentRow = columns;

  // Find the copyright/info text block (outside grid)
  let textBlock = element.querySelector('.cmp-text');
  if (!textBlock) textBlock = element.querySelector('[class*="cmp-text"]');

  // Build table rows: header, content, and text (if present)
  const rows = [headerRow];
  if (contentRow.length) rows.push(contentRow);
  if (textBlock) {
    // The text row must have the same number of columns as contentRow
    const textRow = Array(contentRow.length).fill(null);
    textRow[0] = textBlock;
    rows.push(textRow);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
