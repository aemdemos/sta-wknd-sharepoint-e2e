/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to safely get the first matching descendant by selector, or null
  function getFirst(el, sel) {
    const found = el.querySelector(sel);
    return found || null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Image row (background image)
  let imageCell = '';
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the first <img> inside
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // 3. Content row (title, description, CTA)
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  let contentCell = '';
  if (contentWrapper) {
    // We'll collect the heading and description
    const parts = [];
    const heading = getFirst(contentWrapper, '.cmp-teaser__title');
    if (heading) parts.push(heading);
    const desc = getFirst(contentWrapper, '.cmp-teaser__description');
    if (desc) parts.push(desc);
    // If there is a CTA, add it (not present in this example)
    // const cta = getFirst(contentWrapper, '.cmp-teaser__action');
    // if (cta) parts.push(cta);
    if (parts.length) {
      contentCell = parts;
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
