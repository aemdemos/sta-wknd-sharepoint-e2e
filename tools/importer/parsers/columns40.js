/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the teaser image (left column)
  const imageContainer = element.querySelector('.cmp-teaser__image');
  // Defensive: Find the teaser content (right column)
  const teaserContent = element.querySelector('.cmp-teaser__content');

  // Check for missing columns; fallback to empty divs to keep structure
  const leftCol = imageContainer || document.createElement('div');
  const rightCol = teaserContent || document.createElement('div');

  // Table header as specified
  const headerRow = ['Columns (columns40)'];

  // Build the table cells array
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
