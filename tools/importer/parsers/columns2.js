/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container (holds the columns)
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all immediate children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // Always expect 3 columns: image, navigation, search
  // Defensive: filter by class to ensure correct order
  const imageCol = columns.find(col => col.classList.contains('image')) || document.createElement('div');
  const navCol = columns.find(col => col.classList.contains('navigation')) || document.createElement('div');
  const searchCol = columns.find(col => col.classList.contains('search')) || document.createElement('div');

  // Use the block name as header, per spec
  const headerRow = ['Columns (columns2)'];
  const contentRow = [imageCol, navCol, searchCol];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
