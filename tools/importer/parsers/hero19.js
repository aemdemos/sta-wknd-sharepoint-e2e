/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the teaser block content
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Header row
  const headerRow = ['Hero (hero19)'];

  // Find the image (background)
  let imageCell = '';
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual image element
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      // fallback: if no img, use the wrapper
      imageCell = imageWrapper;
    }
  }

  // Find the content (title, description, etc)
  let contentCell = '';
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Defensive: gather all children (title, description, etc)
    const children = Array.from(contentWrapper.children);
    if (children.length > 0) {
      contentCell = children;
    } else {
      contentCell = contentWrapper;
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
