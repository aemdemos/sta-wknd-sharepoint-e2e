/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block (could be the element itself or its child)
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser') || element;
  }

  // --- HEADER ROW ---
  const headerRow = ['Hero (hero20)'];

  // --- IMAGE ROW ---
  // Find the image element
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  // If image is missing, leave cell empty
  const imageRow = [imageEl ? imageEl : ''];

  // --- CONTENT ROW ---
  const contentEls = [];
  // Title (h2)
  const titleEl = teaser.querySelector('.cmp-teaser__title');
  if (titleEl) contentEls.push(titleEl);
  // Description (div)
  const descEl = teaser.querySelector('.cmp-teaser__description');
  if (descEl) contentEls.push(descEl);
  // CTA (a)
  const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
  if (ctaContainer) {
    const ctaLink = ctaContainer.querySelector('a');
    if (ctaLink) contentEls.push(ctaLink);
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // --- TABLE CREATION ---
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
