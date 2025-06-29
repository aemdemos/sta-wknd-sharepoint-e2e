/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Hero (hero27)'];

  // Second row: background image (may be missing)
  let img = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    img = imageContainer.querySelector('img');
  }
  const imageRow = [img ? img : ''];

  // Third row: text content (headline, subheading, CTA)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentContainer) {
    // Title - usually h2, convert to h1 for Hero
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // Replace title element with h1 (not cloning)
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentParts.push(h1);
    }
    // Subheading/paragraph
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      contentParts.push(desc);
    }
    // CTA link (may be missing)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentParts.push(cta);
    }
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Only a single table, as in the example
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
