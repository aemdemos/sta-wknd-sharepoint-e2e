/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row: matches exactly 'Hero (hero39)'
  const headerRow = ['Hero (hero39)'];

  // Find background image: .cmp-teaser__image (may be absent)
  let imageDiv = element.querySelector('.cmp-teaser__image');
  // If not present, use null (empty cell)
  if (!imageDiv) imageDiv = '';

  // Find content: .cmp-teaser__content (may be absent)
  let contentDiv = element.querySelector('.cmp-teaser__content');
  if (!contentDiv) contentDiv = '';

  // Construct table cells as 1-col, 3-row per spec
  const cells = [
    headerRow,
    [imageDiv],
    [contentDiv],
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the new table
  element.replaceWith(table);
}
