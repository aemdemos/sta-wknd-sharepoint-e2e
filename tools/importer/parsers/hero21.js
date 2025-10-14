/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-teaser__image (background image)
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  let imageEl = '';
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the cmp-teaser__content (text overlay)
  const contentEl = element.querySelector('.cmp-teaser__content');

  // Compose text content for contentRow
  const contentParts = [];
  if (contentEl) {
    const headingEl = contentEl.querySelector('.cmp-teaser__title');
    if (headingEl) contentParts.push(headingEl);
    const descEl = contentEl.querySelector('.cmp-teaser__description');
    if (descEl) contentParts.push(descEl);
  }

  // Table rows
  const headerRow = ['Hero (hero21)'];
  const imageRow = [imageEl || ''];
  const contentRow = [contentParts.length ? contentParts : ''];

  // Create table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
