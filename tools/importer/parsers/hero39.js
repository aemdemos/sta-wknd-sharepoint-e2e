/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main cmp-teaser block
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Header row: always use block name
  const headerRow = ['Hero (hero39)'];

  // Find the image block (background image)
  let imageCell = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Use the entire image wrapper div for resilience
    imageCell = imageWrapper;
  }

  // Find the content block (title, description, etc)
  let contentCell = null;
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Use the entire content wrapper div for resilience
    contentCell = contentWrapper;
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
