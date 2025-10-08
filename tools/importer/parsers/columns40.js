/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns40)
  const headerRow = ['Columns (columns40)'];

  // Defensive: find the main teaser container
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the image (left column)
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageWrapper) {
    // Find the first <img> inside the image wrapper
    imageEl = imageWrapper.querySelector('img');
  }

  // Find the content (right column)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentWrapper) {
    // We'll collect pretitle, title, description, and CTA link
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    const description = contentWrapper.querySelector('.cmp-teaser__description');
    const action = contentWrapper.querySelector('.cmp-teaser__action-link');

    // Compose the content column, preserving order and grouping
    if (pretitle) contentEls.push(pretitle);
    if (title) contentEls.push(title);
    if (description) contentEls.push(description);
    if (action) contentEls.push(action);
  }

  // Build the table rows
  const rows = [
    headerRow,
    [imageEl, contentEls],
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
