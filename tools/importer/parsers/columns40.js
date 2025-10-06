/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser content and image columns
  const contentCol = element.querySelector('.cmp-teaser__content');
  const imageCol = element.querySelector('.cmp-teaser__image');

  // Compose header row as required
  const headerRow = ['Columns (columns40)'];

  // Compose columns row: left = content, right = image
  // Reference the actual DOM elements, do not clone or create new ones
  const columnsRow = [contentCol || '', imageCol || ''];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
