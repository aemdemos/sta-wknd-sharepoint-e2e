/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid containing the footer content
  let grid;
  const grids = element.querySelectorAll('.aem-Grid');
  if (grids.length) {
    grid = grids[grids.length - 1];
  } else {
    grid = element;
  }

  // Get all immediate children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // Find logo image block
  const logoCol = columns.find(col => col.classList.contains('image'));
  // Find navigation block
  const navCol = columns.find(col => col.classList.contains('navigation'));
  // Find "Follow Us" title
  const titleCol = columns.find(col => col.classList.contains('title'));
  // Find social buttons block
  const socialCol = columns.find(col => col.classList.contains('buildingblock'));
  // Find copyright/text block
  const textCol = columns.find(col => col.classList.contains('text'));

  // Compose first column: logo + nav (if present)
  const col1Content = [];
  if (logoCol) col1Content.push(logoCol.cloneNode(true));
  if (navCol) col1Content.push(navCol.cloneNode(true));

  // Compose second column: Follow Us + social buttons
  const col2Content = [];
  if (titleCol) col2Content.push(titleCol.cloneNode(true));
  if (socialCol) col2Content.push(socialCol.cloneNode(true));

  // Compose third column: copyright/text
  const col3Content = [];
  if (textCol) col3Content.push(textCol.cloneNode(true));

  // Build the content row: always three columns for this layout
  const contentRow = [col1Content, col2Content, col3Content];

  // Remove empty columns (no content)
  const filteredContentRow = contentRow.filter(col => col.length > 0);

  // Build the table rows
  const headerRow = ['Columns (columns10)'];

  // Only create the table if there is at least one non-empty column
  if (filteredContentRow.length) {
    const block = WebImporter.DOMUtils.createTable([
      headerRow,
      filteredContentRow,
    ], document);
    element.replaceWith(block);
  }
}
