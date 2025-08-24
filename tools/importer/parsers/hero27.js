/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header as in the example
  const headerRow = ['Hero (hero27)'];

  // 2. Find background image (if present)
  let imageEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // 3. Find title, description, and CTA
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentWrapper) {
    // Title as heading (leave as h2)
    const titleEl = contentWrapper.querySelector('.cmp-teaser__title');
    if (titleEl) {
      contentParts.push(titleEl);
    }
    // Description (div)
    const descEl = contentWrapper.querySelector('.cmp-teaser__description');
    if (descEl) {
      contentParts.push(descEl);
    }
    // CTA link (a)
    const ctaEl = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      contentParts.push(ctaEl);
    }
  }

  // 4. Compose table rows
  const rows = [
    headerRow,
    [imageEl || ''],
    [contentParts.length ? contentParts : '']
  ];

  // 5. Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
