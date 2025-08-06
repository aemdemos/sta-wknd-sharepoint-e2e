/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match the spec
  const headerRow = ['Hero (hero39)'];

  // Find background image row
  // The image is inside .cmp-teaser__image .cmp-image > img
  let imgEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image .cmp-image');
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }
  const imageRow = [imgEl || ''];

  // Content row: This should include all content (title and paragraph) in a single cell
  // It is inside .cmp-teaser__content
  let contentCell = '';
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Only include children (not the wrapper div)
    // This keeps semantic HTML and avoids unnecessary markup
    contentCell = Array.from(contentDiv.childNodes);
  }
  const contentRow = [contentCell && contentCell.length ? contentCell : ''];

  // Compose the block table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
