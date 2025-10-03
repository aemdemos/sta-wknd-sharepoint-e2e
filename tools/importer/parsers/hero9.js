/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList && el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero9)'];

  // 2. Background image row (row 2)
  // Find the image element
  let imgEl = null;
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    const imageWrapper = getDirectChildByClass(teaser, 'cmp-teaser__image');
    if (imageWrapper) {
      // Try to find an <img> inside
      imgEl = imageWrapper.querySelector('img');
    }
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row (row 3): Title, description, CTA
  // We'll collect the heading and description
  let contentParts = [];
  if (teaser) {
    const contentWrapper = getDirectChildByClass(teaser, 'cmp-teaser__content');
    if (contentWrapper) {
      // Title
      const title = contentWrapper.querySelector('.cmp-teaser__title');
      if (title) contentParts.push(title);
      // Description
      const desc = contentWrapper.querySelector('.cmp-teaser__description');
      if (desc) contentParts.push(desc);
      // CTA (not present in this HTML, but future-proof)
      const cta = contentWrapper.querySelector('.cmp-teaser__action-container, .cmp-teaser__action-link');
      if (cta) contentParts.push(cta);
    }
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Compose the table
  const tableRows = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
