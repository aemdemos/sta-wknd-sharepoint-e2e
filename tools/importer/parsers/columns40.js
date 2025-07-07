/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we extract the expected columns: content and image
  // Get the main teaser content (left column)
  const contentCol = element.querySelector('.cmp-teaser__content');
  // Get the image container (right column)
  const imageCol = element.querySelector('.cmp-teaser__image');

  // Defensive: If either is missing, use empty string to keep structure
  const left = contentCol || '';
  const right = imageCol || '';

  // Table structure per requirements
  const cells = [
    ['Columns (columns40)'], // Header row: matches requirement
    [left, right]            // The two column content row
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
