/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the inner cmp-teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // --- HEADER ROW ---
  const headerRow = ['Hero (hero27)'];

  // --- IMAGE ROW ---
  // Find image container
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  let imageRow;
  if (imageContainer) {
    // Find the actual image element
    const img = imageContainer.querySelector('img');
    if (img) {
      imageRow = [img];
    } else {
      imageRow = [''];
    }
  } else {
    imageRow = [''];
  }

  // --- CONTENT ROW ---
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let contentElements = [];
  if (contentContainer) {
    // Title (h2)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentElements.push(title);
    // Description (div)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentElements.push(desc);
    // CTA (link)
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentElements.push(ctaLink);
    }
  }
  const contentRow = [contentElements];

  // --- BUILD TABLE ---
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
