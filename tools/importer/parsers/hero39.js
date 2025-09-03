/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find image element (background image)
  let imageCell = '';
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual image element
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Find content (title, description, etc.)
  let contentCell = '';
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // We'll collect all heading and description elements
    const contentParts = [];
    // Title (h2)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description (div > p)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentParts.push(desc);
    // If there are other elements (e.g., CTA), add here
    // (none in this example)
    if (contentParts.length) {
      contentCell = contentParts;
    }
  }

  // Build table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageCell || ''];
  const contentRow = [contentCell || ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
