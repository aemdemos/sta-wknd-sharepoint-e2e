/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns visually)
  const columns = Array.from(grid.children);

  // For this block, we want three columns: logo/image, navigation, search
  // Defensive: find the relevant blocks by class
  let imageCol = columns.find(col => col.classList.contains('image'));
  let navCol = columns.find(col => col.classList.contains('navigation'));
  let searchCol = columns.find(col => col.classList.contains('search'));

  // Defensive fallback: if not found, set to null
  imageCol = imageCol || null;
  navCol = navCol || null;
  searchCol = searchCol || null;

  // Compose the header row
  const headerRow = ['Columns (columns2)'];

  // Compose the content row
  // Each cell should reference the entire column block
  const contentRow = [imageCol, navCol, searchCol].filter(Boolean);

  // Only create the table if we have at least two columns (image + search, or image + nav, etc)
  if (contentRow.length < 2) return;

  // Build the table data
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
