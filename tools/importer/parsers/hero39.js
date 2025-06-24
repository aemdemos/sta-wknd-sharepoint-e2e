/* global WebImporter */
export default function parse(element, { document }) {
  // Table structure: 1 column, 3 rows (header, image, content)
  // 1. header row: ['Hero']
  // 2. row: [image]
  // 3. row: [title + description]

  // Find the background image element (if any)
  let imageEl = element.querySelector('.cmp-teaser__image img');

  // Find the title, if present
  let titleEl = element.querySelector('.cmp-teaser__title');

  // Find the description, if present
  let descEl = element.querySelector('.cmp-teaser__description');

  // Compose the content row (combine title and description, preserving their semantics)
  let contentRow = [];
  if (titleEl) contentRow.push(titleEl);
  if (descEl) contentRow.push(descEl);

  // If there's no image, use an empty string for the image row
  const rows = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [contentRow.length > 0 ? contentRow : '']
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
