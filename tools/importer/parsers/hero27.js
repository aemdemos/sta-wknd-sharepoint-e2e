/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first descendant matching selector, or null
  function findFirst(el, selector) {
    return el.querySelector(selector);
  }

  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Background image row (2nd row)
  // Find the image inside the block
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Content row (3rd row)
  // Title (h2), description (div), CTA (a)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  let titleEl = null;
  let descEl = null;
  let ctaEl = null;
  if (contentContainer) {
    titleEl = findFirst(contentContainer, '.cmp-teaser__title');
    descEl = findFirst(contentContainer, '.cmp-teaser__description');
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      ctaEl = ctaContainer.querySelector('a');
    }
  }

  // Compose the content cell
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (descEl) contentCell.push(descEl);
  if (ctaEl) contentCell.push(ctaEl);

  // Build the table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentCell]
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
