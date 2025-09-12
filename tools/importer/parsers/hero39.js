/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Hero (hero39)'];

  // Defensive: Find the cmp-teaser__image div (background image)
  let imageDiv = element.querySelector('.cmp-teaser__image');
  let imageRow = [''];
  if (imageDiv) {
    // Use the whole image div as the background image cell
    imageRow = [imageDiv];
  }

  // Defensive: Find the cmp-teaser__content div (text content)
  let contentDiv = element.querySelector('.cmp-teaser__content');
  let contentRow = [''];
  if (contentDiv) {
    // Use the whole content div as the text cell
    contentRow = [contentDiv];
  }

  // Compose the table rows
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
